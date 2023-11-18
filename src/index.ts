import Fastify from 'fastify';
import { exit } from 'node:process';
import { register } from './metrics';

// -- Configuration -- //

// FIXME: Use proper configuration.
const PORT: number = 4210, HOST: string = '0.0.0.0';

// -- Create HTTP Server -- //

const fastify = Fastify({
    logger: true,
});

fastify.get('/metrics', async (_, reply) => {
    reply.header('Content-Type', register.contentType);
    reply.send(await register.metrics());
});

// -- Run HTTP Server -- //

(async () => {
    try {
        await fastify.listen({ port: PORT, host: HOST });
    } catch (error) {
        fastify.log.error(error);
        exit(1);
    }
})().catch((error) => {
    console.error(error);
    exit(1);
});