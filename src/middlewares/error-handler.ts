import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { CustomError } from '../errors/custom-error';
import { prismaCatchHandler } from '../errors/catch-handlers/prisma-error-handler';
import { validationCatchHandler } from '../errors/catch-handlers/validation-error-handler';

const CATCH_HANDLERS = [prismaCatchHandler, validationCatchHandler];

export async function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    const handler = new ErrorHandler(request, reply);
    await handler.handle(error);
}

export class ErrorHandler {
    constructor(
        private request: FastifyRequest,
        private reply: FastifyReply
    ) {}

    public async handle(error: FastifyError) {
        error = await this.handleKnownCatches(error);
        this.logError(error);
        this.alertIfCritical(error);

        if (error instanceof CustomError && error.isOperational) {
            return this.sendResponse(error);
        }

        return this.sendUnknownError();
    }

    private async handleKnownCatches(error: FastifyError): Promise<FastifyError | CustomError> {
        for (const handler of CATCH_HANDLERS) {
            try {
                const handledError = await handler(error);
                if (handledError !== undefined) {
                    return handledError;
                }
            } catch (e: unknown) {
                this.request.log.error(`Catch handler ${handler.name} failed`);
            }
        }
        return error;
    }

    private logError(error: FastifyError) {
        const isCustomError = error instanceof CustomError;

        const logData = {
            message: error.message,
            stack: error.stack,
            url: this.request.url,
            method: this.request.method,
            params: this.request.params,
            query: this.request.query,
            body: this.request.body,
            headers: this.request.headers,
            ...(isCustomError
                ? {
                      error: error.name,
                      code: error.code,
                      statusCode: error.statusCode,
                      isOperational: error.isOperational,
                      details: error.details,
                      debugInfo: error.debugInfo,
                  }
                : {}),
        };

        this.request.log.error(logData);
    }

    private sendResponse(error: CustomError) {
        return this.reply.status(error.statusCode).send({
            status: error.statusCode,
            code: error.code,
            message: error.message,
            details: error.details,
        });
    }

    private sendUnknownError() {
        return this.reply.status(500).send({
            status: 500,
            code: 'INTERNAL_ERROR',
            message: 'Internal Server Error',
        });
    }

    private alertIfCritical(error: FastifyError) {
        if (!(error instanceof CustomError) || !error.isOperational) {
        }
    }
}
