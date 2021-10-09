import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { User } from '../../entity/User';
import { createAccessToken, createRefreshToken } from '../../lib/createAuth';
// import { getValidName } from '../../lib/getValidName';
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_BASE_URL } from '../../config';
import { sendRefreshToken } from '../../lib/sendRefreshToken';

/**
 * ## postTraditionalLogin
 * @param req
 * @param res
 */

export const postTraditionalLogin = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  const user = await User.findOne({ email: email as string });

  if (!user) {
    res.status(401).send('not authenticated');
    throw new Error('Unable to confirm your email or password');
  }

  const match = await compare(password as string, user.password);

  if (!match) {
    res.status(401).send('not authenticated');
    throw new Error('Unable to confirm your email or password');
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res
    .status(302)
    .redirect(`${CLIENT_BASE_URL}?accessToken=${createAccessToken(user)}`);
};

/**
 * ## postTraditionalRegister
 * @param req
 * @param res
 */

export const postTraditionalRegister = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  if (!email || !password) {
    throw new Error(
      'Unable to sign up with the email address, password or name'
    );
  }

  let user = await User.findOne({ email: email as string });
  console.log(user);

  if (user) {
    res.status(401).send('not authenticated');
    throw new Error(
      'Unable to sign up with the email address, password or name'
    );
  }
  const saltRound = 12;
  const hashedPassword = await hash(password as string, saltRound);
  const validName = `user${uuidv4()}`;

  try {
    user = await User.create({
      email: email as string,
      password: hashedPassword,
      displayName: validName,
      insensitiveName: validName,
    }).save();
  } catch (err) {
    console.error(err);
    res.status(401).send('not authenticated');
    throw new Error(
      'Unable to sign up with the email address, password or name'
    );
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res
    .status(302)
    .redirect(`${CLIENT_BASE_URL}?accessToken=${createAccessToken(user)}`);
};

export const postSignOut = (_: Request, res: Response) => {
  res.clearCookie('@procrastination/jid');
  res.status(200).json({ ok: true, statusMessage: 'success' });
};
