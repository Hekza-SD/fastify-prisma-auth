import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';

export class ValidationError extends CustomError {
    constructor(
        message = 'Validation error occurred',
        details?: Record<string, unknown>,
        debugInfo?: Record<string, unknown>,
        isOperational = true
    ) {
        super(message, 400, ErrorCodes.VALIDATION, isOperational, details, debugInfo);
    }
}
