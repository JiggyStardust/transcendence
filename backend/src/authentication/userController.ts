import { FastifyRequest, FastifyReply } from "fastify";
import "fastify";
import bcrypt from "bcrypt";
import { validatePassword, PASSWORD_ERROR_MESSAGE } from "utils/validatePassword";
import { validateUsername, USERNAME_ERROR_MESSAGE } from "utils/validateUsername";
import type { IUserData, DbResult } from "../database/types";

export interface IUpdateDisplayNameBody {
  displayName: string;
}

export async function updateDisplayName(
  request: FastifyRequest<{ Body: IUpdateDisplayNameBody }>,
  reply: FastifyReply,
) {
  const { displayName } = request.body;
  const userID = request.user.id;

  if (!displayName) {
    return reply.code(400).send({ error: USERNAME_ERROR_MESSAGE });
  }

  const sameUsernameAsDisplayName: DbResult<IUserData> = request.server.db.getUser(displayName);
  if (sameUsernameAsDisplayName.ok && sameUsernameAsDisplayName.data.id !== userID) {
    return reply.code(500).send({ error: "Display name is taken" });
  }

  try {
    await request.server.db.user.update({
      where: { id: userID },
      data: { displayName },
    });

    return reply.send({ success: true, data: { userID, displayName } });
  } catch (err) {
    return reply.code(500).send({ error: "Could not update display name" });
  }
}

export async function updatePassword(request: FastifyRequest, reply: FastifyReply) {
  const { oldPassword, newPassword } = request.body as {
    oldPassword: string;
    newPassword: string;
  };

  const user = await request.server.db.user.findUnique({
    where: { id: request.user.id },
  });

  if (!user) return reply.code(404).send({ error: "User not found" });

  const valid = await bcrypt.compare(oldPassword, user.passwordHash);

  if (!valid) return reply.code(400).send({ error: "Incorrect password" });

  if (!validatePassword(newPassword)) {
    return reply.code(400).send({ error: PASSWORD_ERROR_MESSAGE });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await request.server.db.user.update({
    where: { id: user.id },
    data: { passwordHash: hashed },
  });

  return reply.send({ success: true });
}
