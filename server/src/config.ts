import 'dotenv-safe/config';

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || '';
export const CLIENT_BASE_URL = 'http://localhost:3000';
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
export const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
export const TWITTER_CALLBACK = process.env.TWITTER_CALLBACK;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
