import setHours from 'date-fns/fp/setHours';
import { Event } from '../../entity/Event';
import { Status } from '../../entity/module/BaseEventEntity';

//TODO: delete when the create-todo functionality is implemented
export const createTodos = async (): Promise<Event[]> => {
  const now = new Date();
  let list = [];
  const statusArr = Object.values(Status).map((v) => v);
  const statusArrLength = statusArr.length;
  const itemCounts = 50;
  const max = 20;

  for (let i = 0; i < itemCounts; i++) {
    const randomNumber = Math.floor(Math.random() * max);
    const date = new Date(2021, 6, 3 - randomNumber);

    let newTodo = await Event.create({
      name: `name_${randomNumber}`,
      type: 'to_do',
      description: `This is a new todo original_${randomNumber}`,
      expectedDuration: 5 * randomNumber * 1000,
      duration: (i + 1) * randomNumber * 1000,
      createdAt: now,
      startTime: setHours(8, now),
      endTime: setHours(16, now),
      isProcrastinationTime: false,
      status: statusArr[statusArrLength - 1],
      timestamp: [date, date, date],
    }).save();
    list.push(newTodo);
  }

  return list;
};
