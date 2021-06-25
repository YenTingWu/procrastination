import { Request, Response } from 'express';
import { Event } from '../../entity/Event';
import { Calendar } from '../../entity/Calendar';
import { getConnection, getRepository } from 'typeorm';
import compareAsc from 'date-fns/compareAsc';

type RequestEvent = {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  expectedDuration: number;
  calendarUid: string;
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { uid } = req.params;

  if (!uid) {
    res.status(400).send('bad request');
    throw new Error();
  }

  try {
    await getRepository(Event)
      .createQueryBuilder()
      .delete()
      .where('uuid=:uid', { uid })
      .execute();
    res.status(200).send({ ok: true });
  } catch {
    res.status(404).send('not found');
    throw new Error();
  }
};

export const postCreateNewEvent = async (req: Request, res: Response) => {
  const { event }: { event: RequestEvent } = req.body;

  if (!event) {
    res.status(400).send('bad request');
    throw new Error();
  }

  event.startTime = new Date(event.startTime);
  event.endTime = new Date(event.endTime);

  if (compareAsc(event.endTime, event.startTime) === -1) {
    res.status(400);
    throw new Error();
  }

  let calendar = await getRepository(Calendar)
    .createQueryBuilder('calendars')
    .leftJoinAndSelect('calendars.events', 'events')
    .where('calendars.uuid=:uid', { uid: event.calendarUid })
    .getOne();

  if (!calendar) {
    res.status(404);
    throw new Error();
  }

  delete event.calendarUid;

  try {
    const newEvent = await Event.create({ ...event, createdAt: new Date() });
    calendar.events.push(newEvent);
    await Event.save(newEvent);
    await Calendar.save(calendar);
    res
      .status(201)
      .json({ ok: true, status: 'created', data: { event: newEvent } });
  } catch (err) {
    res.status(400);
    console.log(err);
    throw new Error();
  }
};

export const putModifyEvent = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { ...updateProps } = req.body;

  if (!updateProps || !uid) {
    res.status(400);
    throw new Error();
  }

  if (
    updateProps.startTime &&
    updateProps.endTime &&
    compareAsc(updateProps.endTime, updateProps.startTime) === -1
  ) {
    res.status(400).send({ ok: false, data: false });
    throw new Error();
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .update(Event)
      .set({ ...updateProps })
      .where('uuid=:uid', { uid })
      .execute();
    res.status(204).send({ ok: true, data: true });
  } catch (err) {
    res.status(404).send({ ok: false, data: false });
    console.log(err);
    throw new Error();
  }
};
