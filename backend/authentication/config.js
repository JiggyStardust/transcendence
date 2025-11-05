/* JW_SECRET, ACCESS_EXPIRATION etc
        - these values control how the programme creates and validated login tokens
        - JWT secrets ia s ecret key used to sign in to JSON we token (jwt)
        - access tokens are short-lived, refresh tokens are long-lived and both ae signed with secret keys

*/

import 'dotenv/config';

export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
export const ACCESS_EXPIRATION =  process.env.JWT_ACCESS_EXPIRATION || '15m';
export const REFRESH_EXPIRATION =  process.env.JWT_REFRESH_EXPIRATION || '7d';
