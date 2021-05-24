import { ACCESS_TOKEN_SECRET } from '../config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header['authorization'];

  if (!authorization) {
    throw new Error('not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, ACCESS_TOKEN_SECRET);

    res.locals.payload = payload;
  } catch (err) {
    console.error(err);
    throw new Error('not authenticated');
  }

  return next();
};
