import passport from 'passport';
import { Response, Request, NextFunction } from 'express';
import { createAccessToken, createRefreshToken } from '../../lib/createAuth';
import { CLIENT_BASE_URL } from '../../config';
import { User } from 'entity/User';

export const postTwitterOAuth: (
  req: Request,
  res: Response,
  next?: NextFunction
) => any = passport.authenticate('twitter');

export const getTwitterOAuthCallback: (
  req: Request,
  res: Response,
  next?: NextFunction
) => any = passport.authenticate('twitter', {
  session: false,
  failureRedirect: '/login',
});

export const getRedirectBackToEntryPage = (req: Request, res: Response) => {
  const user: User = (req.user as any)._user;

  if (!user) {
    return res.status(401).send('not authenticated');
  }

  return res.redirect(
    `${CLIENT_BASE_URL}?accessToken=${createAccessToken(
      user
    )}&refreshToken=${createRefreshToken(user)}`
  );
};
