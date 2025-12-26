import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';

export class NotImplementedError extends CustomError {
    constructor(
        message = 'Feature not implemented',
        details?: Record<string, unknown>,
        debugInfo?: Record<string, unknown>,
        isOperational = true
    ) {
        super(message, 501, ErrorCodes.NOT_IMPLEMENTED, isOperational, details, debugInfo);
    }
}
