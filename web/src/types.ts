export enum WEEKDAYS {
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
}

export enum EventStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
}

export enum MONTHS {
  Jan,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec,
}

export type DateInfoType = {
  year: number;
  month: number;
  date: number;
};

export interface MonthlyCalendarDateInfoType extends DateInfoType {
  isCurrentMonth?: boolean;
}

export type Event = {
  id: number;
  uuid: string;
  name: string;
  startTime: Date | string;
  endTime: Date | string;
  duration: number;
  expectedDuration: number;
  description: string;
  isProcrastination: boolean;
  status: EventStatus;
  type: 'to_do' | 'event';
  parents?: string[];
  children?: string[];
  timestamp: (string | Date)[];
};

export type Schedule = {
  startTime: Date;
  endTime: Date;
  isFree: boolean;
  expectedDuration: number;
  id?: number;
  uuid?: string;
  duration?: number;
  name?: string;
  description?: string;
  isProcrastination?: boolean;
};

export type Calendar = {
  id: number;
  uuid: string;
  name: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
  events: Event[];
};
export interface User {
  id: number;
  uuid: string;
  displayName: string;
  email: string;
  isVerifiedEmail: boolean;
  twitterId?: string;
  googleId?: string;
  avatar?: string;
  calendars: Calendar[];
}

export enum SocialLoginType {
  GOOGLE = 'google',
  TWITTER = 'twitter',
}
