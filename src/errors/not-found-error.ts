import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';
import { ErrorMessages } from './error-messages';

export class NotFoundError extends CustomError {
    constructor(
        message = ErrorMessages.RESOURCE_NOT_FOUND,
        code = ErrorCodes.NOT_FOUND,
        details?: Record<string, unknown>,
        debugInfo?: Record<string, unknown>,
        isOperational = true
    ) {
        super(message, 404, code, isOperational, details, debugInfo);
    }
}
