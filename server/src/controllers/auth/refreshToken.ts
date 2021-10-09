import { REFRESH_TOKEN_SECRET } from '../../config';
import { Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../entity/User';
import { sendRefreshToken } from '../../lib/sendRefreshToken';
import { createAccessToken, createRefreshToken } from '../../lib/createAuth';

export const getRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies['@procrastination/jid'];

  if (!token) {
    return res.json({ ok: false, accessToken: '' });
  }

  let payload;

  try {
    payload = verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return res.json({ ok: false, accessToken: '' });
  }

  const user = await User.findOne(payload.userId);

  if (!user) {
    return res.json({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.json({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.json({
    ok: true,
    accessToken: createAccessToken(user),
  });
};
