import 'dotenv-safe/config';

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || '';
export const LANDING_PAGE_URL = 'http://localhost:5000/';
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
export const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
export const TWITTER_CALLBACK = process.env.TWITTER_CALLBACK;
export const SESSION_SECRET = process.env.SESSION_SECRET;
