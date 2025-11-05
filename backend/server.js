// import framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import userRoutes from './routes/users.js';
import 'dotenv/config';

const PORT = process.env.BACKEND_PORT || 4000;
const HOST = process.env.BACKEND_HOST || "localhost";

const fastify = Fastify({ logger: true });

// register middleware
fastify.register(cors, { origin: true });
fastify.register(formbody);

// register route module
fastify.register(userRoutes);

// declare a basic route
fastify.get('/', async (request, reply) => {
    return { message: 'Hello PingPong!' } ;
});

//run the server
const start = async () => {
    try {
        fastify.listen({ host: HOST, port: PORT });
        console.log('Server running on http://' + HOST + ":" + PORT);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
