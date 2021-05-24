import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { User } from '../../entity/User';
import { createAccessToken, createRefreshToken } from '../../lib/createAuth';
import { getValidName } from '../../lib/getValidName';

/**
 * ## postTraditionalLogin
 * @param req
 * @param res
 */

export const postTraditionalLogin = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  let user = await User.findOne({ email: email as string });

  if (!user) {
    res.status(401).send('not authenticated');
    throw new Error('Unable to confirm your email or password');
  }

  const match = await compare(password as string, user.password);

  if (!match) {
    res.status(401).send('not authenticated');
    throw new Error('Unable to confirm your email or password');
  }

  res.cookie('@procrastination/jid', createRefreshToken(user), {
    httpOnly: true,
    path: '/auth',
  });

  return res.send({ ok: true, accessToken: createAccessToken(user) });
};

/**
 * ## postTraditionalRegister
 * @param req
 * @param res
 */

export const postTraditionalRegister = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.query;

  if (!email || !password || !displayName) {
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
  const validName = await getValidName(displayName as string);

  try {
    user = await User.create({
      email: email as string,
      password: hashedPassword,
      displayName: validName,
      insensitiveName: validName.toLocaleLowerCase(),
    }).save();
  } catch (err) {
    console.error(err);
    res.status(401).send('not authenticated');
    throw new Error(
      'Unable to sign up with the email address, password or name'
    );
  }

  res.cookie('@procrastination/jid', createRefreshToken(user), {
    httpOnly: true,
    path: '/auth',
  });

  return res.send({ ok: true, accessToken: createAccessToken(user) });
};
