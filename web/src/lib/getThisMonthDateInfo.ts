import { MonthlyCalendarDateInfoType } from '@types';
import lastDayOfMonthFn from 'date-fns/fp/lastDayOfMonth';

// Year is new Date().getYear() format
// Month is new Date().getMonth() format

export const getThisMonthDateInfo = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  // Both Date and Day are the actual value. No need to do extra 1 subtraction
  let datesForCalendar = [];

  const firstDayOfThisMonth = new Date(year, month, 1);
  const firstDayOfNextMonth = new Date(year, month + 1);
  const lastDayOfLastMonth = new Date(year, month, 0);

  // If the current month is January, the year of last month should be last year
  // If the current month is December, the year of next month should be next year
  const yearOfLastMonth = month === 0 ? year - 1 : year;
  const yearOfNextMonth = month === 11 ? year + 1 : year;

  const lastMonth = lastDayOfLastMonth.getMonth();
  const nextMonth = firstDayOfNextMonth.getMonth();

  const lastDayOfThisMonth = lastDayOfMonthFn(firstDayOfThisMonth);

  const firstWeekDayOfThisMonth = firstDayOfThisMonth.getDay();
  const lastWeekDayOfThisMonth = lastDayOfThisMonth.getDay();

  // days in last month should be desc
  // days in next month should be asc
  let dateInLastMonth = lastDayOfLastMonth.getDate();
  let dateInNextMonth = firstDayOfNextMonth.getDate();

  let restOfLastMonthDaysHasToPushIntoCalendar = firstWeekDayOfThisMonth % 7;
  let restOfNextMonthDaysHasToPushIntoCalendar = 6 - lastWeekDayOfThisMonth;

  // Last Month
  while (restOfLastMonthDaysHasToPushIntoCalendar > 0) {
    const dateInfo: MonthlyCalendarDateInfoType = {
      year: yearOfLastMonth,
      month: lastMonth,
      date: dateInLastMonth,
    };

    datesForCalendar.unshift(dateInfo);
    dateInLastMonth -= 1;
    restOfLastMonthDaysHasToPushIntoCalendar--;
  }

  // This Month
  for (let i = 1; i < lastDayOfThisMonth.getDate() + 1; i++) {
    const dateInfo: MonthlyCalendarDateInfoType = {
      year,
      month,
      date: i,
      isCurrentMonth: true,
    };

    datesForCalendar.push(dateInfo);
  }

  // Next Month
  while (
    restOfNextMonthDaysHasToPushIntoCalendar > 0 ||
    datesForCalendar.length < 42
  ) {
    const dateInfo: MonthlyCalendarDateInfoType = {
      year: yearOfNextMonth,
      month: nextMonth,
      date: dateInNextMonth,
    };

    datesForCalendar.push(dateInfo);
    dateInNextMonth++;
    restOfNextMonthDaysHasToPushIntoCalendar--;
  }

  return datesForCalendar;
};
