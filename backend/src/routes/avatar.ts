import type { FastifyPluginAsync } from "fastify";
import { verifyToken } from "../authentication/authMiddleware";
import { IUploadAvatarParams, uploadAvatarHandler } from "../user_management/avatar/uploadAvatarHandler";
import { IResetAvatarParams, resetAvatarHandler } from "../user_management/avatar/resetAvatarHandler";

const avatarRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{ Params: IUploadAvatarParams }>("/:username/avatar", { preHandler: verifyToken }, uploadAvatarHandler);

  fastify.delete<{ Params: IResetAvatarParams }>("/:username/avatar", { preHandler: verifyToken }, resetAvatarHandler);
};

export default avatarRoutes;
