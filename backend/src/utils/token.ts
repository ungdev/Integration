import { verify } from 'jsonwebtoken';
import type { AuthTokenPayload } from '../types/auth';
import { jwtSecret } from '../utils/secret';

export const decodeToken = (token: string): AuthTokenPayload | null => {
    if (!token) {
        return null;
    }
    try {
        return verify(token, jwtSecret) as AuthTokenPayload;
    } catch {
        return null;
    }
};
