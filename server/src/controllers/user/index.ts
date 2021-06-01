import { Request, Response } from 'express';

export const getUserData = (req: Request, res: Response) => {
  res.send(JSON.stringify('This is user data'));
};
