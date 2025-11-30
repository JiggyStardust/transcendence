import type { FastifyRequest, FastifyReply } from "fastify";
import { AvatarType } from "@prisma/client";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import type { DbResult, IUserData } from "../../database/types";

export interface IUploadAvatarParams {
  username: string;
}

const ALLOWED_MIMETYPES = ["image/png", "image/jpeg", "image/jpg"];

export const uploadAvatarHandler = async (
  req: FastifyRequest<{ Params: IUploadAvatarParams }>,
  reply: FastifyReply,
) => {
  const user = (req as any).user;
  const { username } = req.params;

  if (user.username !== username) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const result: DbResult<IUserData> = await req.server.db.getUserProfile(username);

  if (!result.ok) {
    return reply.code(404).send({ error: "User not found" });
  }

  const dbUser = result.data;

  const file = await req.file();
  if (!file) {
    return reply.code(400).send({ error: "No file uploaded" });
  }

  // return reply.code(400).send({ error: "File size limit reached" });

  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    return reply.code(400).send({ error: "Invalid file type" });
  }

  const ext = path.extname(file.filename) || ".png";
  const newFileName = `${dbUser.id}${ext}`;

  const uploadsRoot = path.join(process.cwd(), "uploads");
  const avatarDir = path.join(uploadsRoot, "avatars");

  await fs.promises.mkdir(avatarDir, { recursive: true });

  const newFilePath = path.join(avatarDir, newFileName);

  await pipeline(file.file, fs.createWriteStream(newFilePath));
  if (file.file.truncated) {
    await fs.promises.unlink(newFilePath).catch(() => {});
    return reply.code(413).send({ error: "File too large" });
  }

  const newAvatarUrl = `/uploads/avatars/${newFileName}`;

  await req.server.db.user.update({
    where: { id: dbUser.id },
    data: {
      avatarURL: newAvatarUrl,
      avatarType: AvatarType.CUSTOM,
    },
  });

  return reply.send({ avatarURL: newAvatarUrl });
};
