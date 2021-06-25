import { Request, Response } from 'express';
import setHours from 'date-fns/fp/setHours';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';
import { Calendar } from '../../entity/Calendar';
import { Event } from '../../entity/Event';
import { Status } from '../../entity/module/BaseEventEntity';

//TODO: delete when the create-todo functionality is implemented
const createTodos = async (): Promise<Event[]> => {
  const now = new Date();
  let list = [];
  const statusArr = Object.values(Status).map((v) => v);

  for (let i = 0; i < 3; i++) {
    let newTodo = await Event.create({
      name: `New Event original_${statusArr[i]}`,
      type: 'to_do',
      description: `This is a new todo original_${statusArr[i]}`,
      expectedDuration: 8 * 60 * 60,
      duration: 0,
      createdAt: now,
      startTime: setHours(8, now),
      endTime: setHours(16, now),
      isProcrastinationTime: false,
      status: statusArr[i],
    }).save();
    list.push(newTodo);
  }

  return list;
};

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

      let newEvent = await Event.create({
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

      //TODO: delete when the create-todo functionality is implemented
      const todos = await createTodos();

      let newCalendar = await Calendar.create({
        name: 'The new calendar',
        createdAt: now,
        modifiedAt: now,
      });

      newCalendar.events = [newEvent, ...todos];
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
