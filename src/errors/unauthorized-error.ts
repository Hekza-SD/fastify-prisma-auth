import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';

export class UnauthorizedError extends CustomError {
    constructor(
        message = 'Unauthorized',
        details?: Record<string, unknown>,
        debugInfo?: Record<string, unknown>,
        isOperational = true
    ) {
        super(message, 401, ErrorCodes.UNAUTHORIZED, isOperational, details, debugInfo);
    }
}
