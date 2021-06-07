export enum WEEKDAYS {
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
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
