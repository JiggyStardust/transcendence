import type { FastifyRequest, FastifyReply } from "fastify";
import { AvatarType } from "@prisma/client";
import fs from "fs";
import path from "path";
import type { DbResult, IUserProfile } from "../../database/types";

export interface IResetAvatarParams {
  username: string;
}

const DEFAULT_AVATAR_URL = "/uploads/avatars/default.jpeg";

export const resetAvatarHandler = async (req: FastifyRequest<{ Params: IResetAvatarParams }>, reply: FastifyReply) => {
  const authUser = (req as any).user;
  const { username } = req.params;

  if (authUser.username !== username) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const result: DbResult<IUserProfile> = await req.server.db.getUserProfile(username);
  if (!result.ok) {
    return reply.code(404).send({ error: "User not found" });
  }

  const dbUser = result.data;

  // If current avatar is custom, try to delete file
  if (dbUser.avatarType === AvatarType.CUSTOM) {
    const uploadsRoot = path.join(process.cwd(), "uploads");
    const avatarDir = path.join(uploadsRoot, "avatars");
    const avatarFilename = path.basename(dbUser.avatarURL);

    if (!avatarFilename || avatarFilename.includes("/") || avatarFilename.includes("\\")) {
      return reply.code(400).send({ error: "Invalid avatar filename" });
    }

    const filePath = path.join(avatarDir, avatarFilename);

    const relative = path.relative(avatarDir, filePath);

    // Validate: file must remain inside avatarDir
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return reply.code(400).send({ error: "Invalid avatar path" });
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      req.log.warn({ err }, "Failed to delete custom avatar on reset");
    }
  }

  try {
    await req.server.db.user.update({
      where: { id: dbUser.id },
      data: {
        avatarURL: DEFAULT_AVATAR_URL,
        avatarType: AvatarType.DEFAULT,
      },
    });
  } catch (err) {
    return reply.code(500).send({ error: "Failed to update avatar" });
  }

  return reply.send({ avatarURL: DEFAULT_AVATAR_URL });
};
