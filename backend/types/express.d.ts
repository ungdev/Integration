import type { AuthTokenPayload } from '../src/types/auth';

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
            permission?: string;
        }
    }
}

export {};
