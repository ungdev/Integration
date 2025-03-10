import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtSecret } from '../utils/secret';

export const decodeToken = (token: string) => {
    
    if (!token) {
        return null
    }
    try {
        return verify(token, jwtSecret);
    } catch (error) {
        return null
    }
};