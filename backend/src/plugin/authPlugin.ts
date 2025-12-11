import fp from "fastify-plugin";
import { 
    FastifyPluginAsync,
    FastifyRequest,
    FastifyReply, 
} from "fastify";



const authPlugin: FastifyPluginAsync = async (fastify) => {

    // add authentication decorator
    fastify.decorate(
        "authenticate",
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify(); // verifies and populates user request
            } catch (err) {
                return reply.code(401).send({ error: "Unauthorized" });
            }
        }
    );
};

export default fp(authPlugin);
