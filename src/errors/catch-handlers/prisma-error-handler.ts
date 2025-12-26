import { DatabaseError } from '../database-error';
import type { CustomError } from '../custom-error';
import z from 'zod';
import type { FastifyError } from 'fastify';
import { ErrorCodes } from '../error-codes';

const prismaErrorSchema = z.object({
    name: z.string(),
    code: z.string(),
    message: z.string(),
    meta: z.any(),
});

/**
 * Transforms Prisma known request errors into DatabaseError instances.
 *
 * @param err - The error to handle.
 * @returns A DatabaseError if the error matches known Prisma errors, otherwise undefined.
 */
export function prismaCatchHandler(err: FastifyError): CustomError | undefined {
    const parseResult = prismaErrorSchema.safeParse(err);

    if (parseResult.success) {
        const parsedError = parseResult.data;

        if (parsedError.code === 'P1017') {
            return new DatabaseError('Database constraint error', undefined, {
                originalError: {
                    name: parsedError.name,
                    code: parsedError.code,
                    message: parsedError.message,
                },
            });
        }

        if (parsedError.code === 'P2002') {
            return new DatabaseError(
                'Unique constraint violation',
                ErrorCodes.ALREADY_EXISTS,
                undefined,
                {
                    originalError: {
                        name: parsedError.name,
                        code: parsedError.code,
                        message: parsedError.message,
                    },
                }
            );
        }

        if (parsedError.code === 'P2025') {
            return new DatabaseError('Record not found', ErrorCodes.NOT_FOUND, undefined, {
                originalError: {
                    name: parsedError.name,
                    code: parsedError.code,
                    message: parsedError.message,
                },
            });
        }

        if (parsedError.code === 'P2003') {
            return new DatabaseError(
                'Foreign key constraint violation',
                ErrorCodes.BAD_REQUEST,
                undefined,
                {
                    originalError: {
                        name: parsedError.name,
                        code: parsedError.code,
                        message: parsedError.message,
                    },
                }
            );
        }

        /**
         * Handle other known PrismaClientKnownRequestError.
         */
        if (parsedError.name === 'PrismaClientKnownRequestError') {
            return new DatabaseError(
                'Operation failed',
                ErrorCodes.DATABASE_ERROR,
                undefined,
                {
                    originalError: {
                        name: parsedError.name,
                        code: parsedError.code,
                        message: parsedError.message,
                    },
                },
                false
            );
        }
    }

    return undefined;
}
