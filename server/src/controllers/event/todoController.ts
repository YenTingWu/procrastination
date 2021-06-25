import { Status } from 'entity/module/BaseEventEntity';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../entity/Calendar';
import { Event } from '../../entity/Event';

type TodoInfo = {
  name: string;
  description: string;
  expectedDuration: number;
  calendarUid: string;
};

export const postCreateTodo = async (req: Request, res: Response) => {
  const { todoInfo }: { todoInfo: TodoInfo } = req.body;

  if (!todoInfo) {
    res.status(400).send('bad request');
    throw new Error();
  }

  let calendar = await getRepository(Calendar)
    .createQueryBuilder('calendars')
    .leftJoinAndSelect('calendars.events', 'events')
    .where('calendars.uuid=:uid', { uid: todoInfo.calendarUid })
    .getOne();

  if (!calendar) {
    res.status(404).send('not found');
    throw new Error();
  }

  delete todoInfo.calendarUid;

  try {
    let newTodo = await Event.create({
      ...todoInfo,
      createdAt: new Date(),
      type: 'to_do',
    });
    calendar.events.push(newTodo);
    await Event.save(newTodo);
    await Calendar.save(calendar);
    res
      .status(201)
      .json({ ok: true, status: 'created', data: { todo: newTodo } });
  } catch {
    res.status(400);
    throw new Error();
  }
};

type UpdatableField = {
  name: string;
  description: string;
  expectedDuration: number;
  duration: number;
  status: Status;
};

export const patchUpdateTodo = async (req: Request, res: Response) => {
  const {
    uid,
    updatedStore,
  }: { uid: string; updatedStore: Partial<UpdatableField> } = req.body;

  if (!updatedStore || Object.keys(updatedStore).length === 0) {
    res.status(400).json({
      ok: false,
      statusMessage: 'bad request',
    });
    throw new Error();
  }
  try {
    const newList = await getRepository(Event)
      .createQueryBuilder('events')
      .where('events.uuid = :uid', { uid })
      .update({ ...updatedStore })
      .execute();
    console.log(newList);
    res.status(201).json({
      ok: true,
      statusMessage: 'created',
    });
  } catch {
    res.status(400).json({
      ok: false,
      statusMessage: 'bad request',
    });
  }
};
