import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';

export class OrganizationError extends CustomError {
    constructor(
        message: string,
        statusCode: number,
        errorCode: ErrorCodes,
        details?: Record<string, unknown>,
        debugInfo?: Record<string, unknown>,
        isOperational = true
    ) {
        super(message, statusCode, errorCode, isOperational, details, debugInfo);
    }
}
