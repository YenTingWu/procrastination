import { Router } from 'express';
import {
  postTraditionalLogin,
  postTraditionalRegister,
} from '../controllers/auth';
import { getRefreshToken } from '../controllers/auth/refreshToken';
import {
  postGoogleAuthentication,
  getGoogleAuthenticationCallback,
} from '../controllers/auth/googleOAuth2';
import {
  postTwitterOAuth,
  getTwitterOAuthCallback,
  getRedirectBackToEntryPage,
} from '../controllers/auth/twitterOauth';

/**
 * Social Sign-up
 * 1. Get user data from google or twitter with Oauth authentication.
 * 2. Send accessToken and refreshToken, which both created in procrastination server,
 *    to user agent.
 * 3. User agent requests the user data with accessToken to be confirmed authenticated.
 */

/**
 * Traditional Sign-up
 * 1. Get user data from user
 * 2. Send accessToken and refreshToken, which both created in procrastination server,
 *    to user agent.
 * 3. User agent requests the user data with accessToken to be confirmed authenticated.
 */

const router = Router();

router.get('/refresh_token', getRefreshToken);
router.post('/login', postTraditionalLogin);
router.post('/register', postTraditionalRegister);
router.post('/twitter/web', postTwitterOAuth);
router.post('/google/web', postGoogleAuthentication);

/** TODO:
 * create tokens for client-Oauth after twitter auth callback
 */
router.get(
  '/twitter/web/oauthcallback',
  getTwitterOAuthCallback,
  getRedirectBackToEntryPage
);

router.get('/google/web/oauth2callback', getGoogleAuthenticationCallback);

export default router;
