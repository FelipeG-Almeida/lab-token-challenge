import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
    constructor(message: string = 'Você não tem permissão') {
        super(401, message);
    }
}
