// import framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import userRoutes from './routes/users.js';

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
        await fastify.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();