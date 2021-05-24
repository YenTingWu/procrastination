import { Router } from 'express';
import {
  getGoogleAuthentication,
  getGoogleAuthenticationCallback,
} from '../controllers/auth/googleOAuth2';
import {
  getTwitterOAuth,
  getTwitterOAuthCallback,
} from '../controllers/auth/twitterOauth';

const router = Router();

router.get('/twitter/web', getTwitterOAuth);

/** TODO:
 * create tokens for client-Oauth after twitter auth callback
 */
router.get(
  '/twitter/web/oauthcallback',
  getTwitterOAuthCallback,
  (req, res) => {
    console.log('req', req);
    return res.redirect('/success');
  }
);

router.get('/google/web', getGoogleAuthentication);
router.get('/google/web/oauth2callback', getGoogleAuthenticationCallback);

export default router;
