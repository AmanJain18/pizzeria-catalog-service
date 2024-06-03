import { expressjwt, GetVerificationKey } from 'express-jwt';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';
import { AuthCookie } from '../common/types';
import config from 'config';

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: config.get('catalogService.auth.jwksUri'),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        try {
            const authHeader = req.headers.authorization;
            // Check if the token is in the Authorization header or in the cookie
            // Bearer token format is: Bearer <token>
            if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
                const token = authHeader.split(' ')[1];
                if (token) {
                    return token;
                }
            }
            const { accessToken } = req.cookies as AuthCookie;
            return accessToken;
        } catch (err) {
            throw new Error('Error retrieving token');
        }
    },
});
