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
    try {
      const uploadsRoot = path.join(process.cwd(), "uploads");
      const relative = dbUser.avatarURL.replace("/uploads/", "");
      const filePath = path.join(uploadsRoot, relative);

      const avatarDir = path.join(uploadsRoot, "avatars");
      if (filePath.startsWith(avatarDir)) {
        await fs.promises.unlink(filePath);
      }

      await req.server.db.user.update({
        where: { id: dbUser.id },
        data: {
          avatarUrl: DEFAULT_AVATAR_URL,
          avatarType: AvatarType.DEFAULT,
        },
      });
    } catch (err) {
      req.log.warn({ err }, "Failed to delete custom avatar on reset");
    }
  }

  return reply.send({ avatarURL: DEFAULT_AVATAR_URL });
};
