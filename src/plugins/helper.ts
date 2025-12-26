import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { stringifyDates } from '../utils/stringify-dates';

export const helperPlugin = fp(async (fastify: FastifyInstance) => {
    fastify.decorateReply('sendWithDates', function (payload) {
        return this.send(stringifyDates(payload));
    });
});

declare module 'fastify' {
    interface FastifyReply {
        sendWithDates<T = unknown>(payload: T): FastifyReply;
    }
}
