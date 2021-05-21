import { google } from 'googleapis';
import { Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../entity/User';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  LANDING_PAGE_URL,
} from '../../config';

/**
 * ### getValidName
 * If the name exists in the database, return a displayName with uuid
 * If not, return the original name
 * @param fullName
 * @returns booleans
 */

async function getValidName(fullName: string): Promise<string> {
  const users = await User.find({
    insensitiveName: Like(`%${fullName.toLowerCase()}%`),
  });

  if (users.length) return `${fullName}${uuidv4()}`;
  return fullName;
}

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
    const { picture, name } = userInfo.data;
    const validName = await getValidName(name);

    let newUser = new User();
    newUser.avatar = picture;
    newUser.email = email;
    newUser.displayName = validName;
    newUser.insensitiveName = validName.toLowerCase();
    newUser.password = '';
    newUser.isSocialLogin = true;

    await User.insert(newUser);
  }

  return res.redirect(
    `${LANDING_PAGE_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};
