import { EventStatus, Event } from '@types';

const completedEvents: Event[] = [
  {
    id: 0,
    type: 'to_do',
    description: 'aksdjflaksjdflasdjflkajsdlfkjasldfkasd',
    uuid: '12312312fkladjflkasjdf',
    name: 'mock_1',
    startTime: new Date(2021, 5, 20),
    endTime: new Date(2021, 6, 30),
    duration: 5 * 60 * 60,
    expectedDuration: 7 * 60 * 60,
    isProcrastination: false,
    status: EventStatus.COMPLETED,
    parents: [],
    children: [],
    timestamp: [
      new Date(2021, 5, 30),
      new Date(2021, 5, 30),
      new Date(2021, 5, 30),
    ],
  },
];

export { completedEvents };
