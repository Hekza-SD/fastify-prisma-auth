import type { CustomError } from '../custom-error';
import type { FastifyError } from 'fastify';
import { ValidationError } from '../validation-error';

/**
 * Transforms Ajv known validation errors into ValidationError instances.
 *
 * @param err - The error to handle.
 * @returns A ValidationError if the error matches known Ajv validation errors, otherwise undefined.
 */
export function validationCatchHandler(err: FastifyError): CustomError | undefined {
    if (err.validation) {
        return new ValidationError(
            'Bad Request - Validation Error',
            {
                validationErrors: err.validation.map(
                    (e) => e.message || 'Unknown validation error'
                ),
            },
            {
                originalError: err,
                validationErrors: err.validation,
            }
        );
    }

    return undefined;
}
