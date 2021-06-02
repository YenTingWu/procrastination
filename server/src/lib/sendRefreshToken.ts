import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('@procrastination/jid', token, {
    httpOnly: true,
    sameSite: 'lax',
    /*
     * TODO: After publishing, turn secure attribute on
     */
    // secure: true
  });
};
