import { Request, Response } from 'express';
// import { User } from '../../entity/User';
// import { getConnection } from 'typeorm';

export const getUserData = async (req: Request, res: Response) => {
  const { payload } = res.locals;

  if (!payload || !payload.userId) {
    res.status(401).send('not authenticated');
    throw Error('not authenticated');
  }

  // await getConnection().createQueryBuilder().relation(User, 'calendars')

  res.setHeader('content-type', 'json/application');

  res.send(JSON.stringify('This is user data'));
};
