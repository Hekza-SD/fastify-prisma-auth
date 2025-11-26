import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { fromNodeHeaders } from 'better-auth/node';
import { ErrorMessages } from '../../errors/error-messages';

export const requireAuth = async (req: FastifyRequest, _res: FastifyReply) => {
    const session = await req.server.auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
        throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
    }

    req.session = session;
};
