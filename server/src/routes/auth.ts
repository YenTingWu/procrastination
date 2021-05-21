import { Router } from 'express';
import {
  getGoogleAuthentication,
  getGoogleAuthenticationCallback,
} from '../controllers/auth/googleOAuth2';

const router = Router();

router.get('/google/web', getGoogleAuthentication);
router.get('/google/web/oauth2callback', getGoogleAuthenticationCallback);

export default router;
