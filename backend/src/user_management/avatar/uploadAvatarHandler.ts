import type { FastifyRequest, FastifyReply } from "fastify";
import { AvatarType } from "@prisma/client";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import type { DbResult, IUserProfile } from "../../database/types";

export interface IUploadAvatarParams {
  username: string;
}

// Derive extension from mimetype, not user-provided filename
const MIMETYPE_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/jpg": ".jpg",
};

export const uploadAvatarHandler = async (
  req: FastifyRequest<{ Params: IUploadAvatarParams }>,
  reply: FastifyReply,
) => {
  const user = (req as any).user;
  const { username } = req.params;

  if (user.username !== username) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const result: DbResult<IUserProfile> = await req.server.db.getUserProfile(username);

  if (!result.ok) {
    return reply.code(404).send({ error: "User not found" });
  }

  const dbUser = result.data;

  const file = await req.file();
  if (!file) {
    return reply.code(400).send({ error: "No file uploaded" });
  }

  const mimetype = file.mimetype;

  if (!(mimetype in MIMETYPE_TO_EXT)) {
    return reply.code(400).send({ error: "Invalid file type" });
  }

  const expectedExt = MIMETYPE_TO_EXT[mimetype];
  const ext = path.extname(file.filename);

  if (!ext || expectedExt !== ext) {
    return reply.code(400).send({ error: "Invalid file type" });
  }

  const newFileName = `${dbUser.id}${ext}`;

  const uploadsRoot = path.join(process.cwd(), "uploads");
  const avatarDir = path.join(uploadsRoot, "avatars");

  await fs.promises.mkdir(avatarDir, { recursive: true });

  const newFilePath = path.join(avatarDir, newFileName);

  try {
    await pipeline(file.file, fs.createWriteStream(newFilePath));
  } catch (err) {
    await fs.promises.unlink(newFilePath).catch(() => {});
    return reply.code(500).send({ error: "Failed to save avatar file" });
  }

  if (file.file.truncated) {
    await fs.promises.unlink(newFilePath).catch(() => {});
    return reply.code(413).send({ error: "File too large" });
  }

  const newAvatarUrl = `/uploads/avatars/${newFileName}`;

  try {
    await req.server.db.user.update({
      where: { id: dbUser.id },
      data: {
        avatarURL: newAvatarUrl,
        avatarType: AvatarType.CUSTOM,
      },
    });
  } catch (err) {
    await fs.promises.unlink(newFilePath).catch(() => {});
    return reply.code(500).send({ error: "Failed to update avatar" });
  }

  return reply.send({ avatarURL: newAvatarUrl });
};
