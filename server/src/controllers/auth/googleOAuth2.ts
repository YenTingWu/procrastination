import { Request, Response } from 'express';
import { google } from 'googleapis';
import { User } from '../../entity/User';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  CLIENT_BASE_URL,
} from '../../config';

import { getValidName } from '../../lib/getValidName';
import { createAccessToken, createRefreshToken } from '../../lib/createAuth';

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

export const postGoogleAuthentication = (_req: Request, res: Response) => {
  let scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.header('Access-Control-Allow-Origin', '*');

  return res.json({ url });
};

/**
 * ## getGoogleAuthenticationCallback
 * A controller to handle google auth callback
 * @param req
 * @param res
 * @returns redirect to user-agent's landing page with accessToken and refresh Token
 */

export const getGoogleAuthenticationCallback = async (
  req: Request,
  res: Response
) => {
  const { code } = req.query;

  if (typeof code !== 'string') {
    throw new Error('not authenticated');
  }

  let userInfo;
  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    userInfo = await oauth2.userinfo.v2.me.get();
  } catch (err) {
    console.error(err);
    throw new Error('not authenticated');
  }

  const { email, id } = userInfo.data;
  let user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    const { picture, name, verified_email } = userInfo.data;
    const validName = await getValidName(name);

    user = await User.create({
      email,
      avatar: picture,
      displayName: validName,
      insensitiveName: validName.toLocaleLowerCase(),
      googleId: id,
      isVerifiedEmail: verified_email,
    }).save();
  } else if (!user.googleId) {
    user.googleId = id;
    await user.save();
  }

  return res.redirect(
    `${CLIENT_BASE_URL}?accessToken=${createAccessToken(
      user
    )}&refreshToken=${createRefreshToken(user)}`
  );
};
