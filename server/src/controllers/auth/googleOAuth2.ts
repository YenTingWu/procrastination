import { google } from 'googleapis';
import { User } from '../../entity/User';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  LANDING_PAGE_URL,
} from '../../config';
import { SOCIAL_LOGIN_TYPE } from '../../types';
import { getValidName } from '../../lib/getValidName';

let oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

/**
 * ## getGoogleAuthentication
 * A controller to redirect user agent to google authentication page to get Oauth2
 * @param _req
 * @param res
 * @returns redirect to google auth page
 */

export const getGoogleAuthentication = (_req, res) => {
  let scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  return res.redirect(url);
};

/**
 * ## getGoogleAuthenticationCallback
 * A controller to handle google auth callback
 * @param req
 * @param res
 * @returns redirect to user-agent's landing page with accessToken and refresh Token
 */

export const getGoogleAuthenticationCallback = async (req, res) => {
  const { code } = req.query;

  if (typeof code !== 'string') {
    throw Error('not authenticated');
  }

  let accessToken = '';
  let refreshToken = '';
  let userInfo;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    userInfo = await oauth2.userinfo.v2.me.get();
  } catch (err) {
    console.error(err);
    throw Error('not authenticated');
  }

  const { email } = userInfo.data;
  const user = await User.findOne({ email });

  if (!user) {
    const { picture, name, id } = userInfo.data;
    const validName = await getValidName(name);

    let newUser = new User();
    newUser.avatar = picture;
    newUser.email = email;
    newUser.displayName = validName;
    newUser.insensitiveName = validName.toLowerCase();
    newUser.googleId = id;
    newUser.socialLoginType = SOCIAL_LOGIN_TYPE.GOOGLE;
    await User.insert(newUser);
  }

  /** TODO:
   * Client-side accessToken and refreshToken should be created by procrastination server,
   * instead of google Oauth2 server
   */
  return res.redirect(
    `${LANDING_PAGE_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};
