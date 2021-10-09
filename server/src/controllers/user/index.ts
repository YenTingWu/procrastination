import { Request, Response } from 'express';
import setHours from 'date-fns/fp/setHours';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';
import { Calendar } from '../../entity/Calendar';
import { Event } from '../../entity/Event';

export const getUserData = async (_: Request, res: Response) => {
  const { payload } = res.locals;

  if (!payload || !payload.userId) {
    res.status(401).send('not authenticated');
    throw Error('not authenticated');
  }

  let user: User;

  try {
    user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.calendars', 'calendars')
      .leftJoinAndSelect('calendars.events', 'events')
      .where('user.id = :id', { id: payload.userId })
      .getOne();

    if (user == null) {
      res.status(401).send('not authenticated');
      throw Error('not authenticated');
    }

    if (user.calendars.length === 0) {
      const now = new Date();

      const newEvent = await Event.create({
        name: 'New event',
        type: 'event',
        description: 'This is an event example',
        expectedDuration: 8 * 60 * 60,
        duration: 0,
        createdAt: now,
        startTime: setHours(8, now),
        endTime: setHours(16, now),
        isProcrastinationTime: false,
      });

      // //TODO: delete when the create-todo functionality is implemented
      // const todos = await createTodos();

      const newCalendar = await Calendar.create({
        name: 'The new calendar',
        createdAt: now,
        modifiedAt: now,
      });

      newCalendar.events = [newEvent];
      user.calendars.push(newCalendar);

      await Event.save(newEvent);
      await Calendar.save(newCalendar);
      user = await User.save(user);
    }
  } catch (err) {
    console.log(err);
  }

  res.setHeader('content-type', 'json/application');

  delete user.insensitiveName;
  delete user.tokenVersion;
  delete user.password;
  delete user.googleId;
  delete user.twitterId;

  res.json(user);
};

export const patchUpdateUser = async (req: Request, res: Response) => {
  const { userUid } = req.params;
  const { updatedStore } = req.body;

  console.log(userUid, updatedStore);
  if (!userUid || updatedStore == null) {
    res.status(400).json({
      ok: false,
      statusMessage: 'bad request',
    });
  }

  try {
    await getRepository(User)
      .createQueryBuilder('users')
      .update({ ...updatedStore })
      .where('users.uuid=:uid', { uid: userUid })
      .execute();
  } catch {
    res.status(404).json({
      ok: false,
      statusMessage: 'not found',
    });
  }

  res.status(201).json({
    ok: true,
    statusMessage: 'created',
  });
};
