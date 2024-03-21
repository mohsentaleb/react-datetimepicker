import {
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isSameYear,
  subMonths,
  addMonths,
  getDay,
  subDays,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  addDays,
  getMonth as dateFnsGetMonth,
  getYear as dateFnsGetYear,
} from 'date-fns';
import { Mode } from '../types';

export const generateHours = () => {
  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }
  return hours;
};

export const generateMinutes = () => {
  let minutes = [];
  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      minutes.push(`0${i.toString()}`);
    } else {
      minutes.push(i.toString());
    }
  }
  return minutes;
};

function workOutMonthYear(
  date: Date,
  secondDate: Date,
  mode?: Mode,
  pastSearchFriendly?: boolean,
  smartMode?: boolean
) {
  // If both months are different months then
  // allow normal display in the calendar
  if (!isSameMonth(date, secondDate)) {
    return date;
  }
  // If pastSearch Friendly mode is on and both months are the same and the same year
  // have "end"/right as the month and "start"/left as -1 month
  else if (isSameYear(date, secondDate) && mode === 'start' && pastSearchFriendly && smartMode) {
    let lastMonth = subMonths(date, 1);
    return lastMonth;
  }
  // If pastSearch Friendly mode is off and both months are the same and the same year
  // have "end"/right as the month and "start"/left as +1 month
  else if (isSameYear(date, secondDate) && mode === 'end' && !pastSearchFriendly && smartMode) {
    let lastMonth = addMonths(date, 1);
    return lastMonth;
  } else {
    return date;
  }
}

export const getMonth = (
  date: Date,
  secondDate: Date,
  mode?: Mode,
  pastSearchFriendly?: boolean,
  smartMode?: boolean
) => dateFnsGetMonth(workOutMonthYear(date, secondDate, mode, pastSearchFriendly, smartMode));

export const getYear = (date: Date, secondDate: Date, mode?: Mode, pastSearchFriendly?: boolean, smartMode?: boolean) =>
  dateFnsGetYear(workOutMonthYear(date, secondDate, mode, pastSearchFriendly, smartMode));

const getDaysBeforeStartMonday = (firstDayOfMonth: Date) => {
  let fortyTwoDays = [];
  let dayBeforeFirstDayOfMonth = getDay(firstDayOfMonth) - 1; // We dont want to include the first day of the new month
  // Case whereby day before is a Saturday (6) and we require Saturday back to Monday for that week
  if (dayBeforeFirstDayOfMonth === -1) {
    for (let i = 6; i > 0; i--) {
      let previousDay = subDays(firstDayOfMonth, i);
      fortyTwoDays.push(previousDay);
    }
  }
  // Case Whereby day before first day is the Sunday (0), therefore we want the entire previous week
  if (dayBeforeFirstDayOfMonth === 0) {
    for (let i = 7; i > 0; i--) {
      let previousDay = subDays(firstDayOfMonth, i);
      fortyTwoDays.push(previousDay);
    }
  }
  // Every other day
  else {
    for (let i = dayBeforeFirstDayOfMonth; i > 0; i--) {
      let previousDay = subDays(firstDayOfMonth, i);
      fortyTwoDays.push(previousDay);
    }
  }
  return fortyTwoDays;
};

const getDaysBeforeStartSunday = (firstDayOfMonth: Date) => {
  let fortyTwoDays = [];
  let dayBeforeFirstDayOfMonth = getDay(firstDayOfMonth) - 1; // We dont want to include the first day of the new month

  // Case whereby we need all previous week days
  if (dayBeforeFirstDayOfMonth === -1) {
    for (let i = 7; i > 0; i--) {
      for (let i = 7; i > 0; i--) {
        let previousDay = subDays(firstDayOfMonth, i);
        fortyTwoDays.push(previousDay);
      }
    }
  }
  // Every other day
  else {
    for (let i = dayBeforeFirstDayOfMonth + 1; i > 0; i--) {
      let previousDay = subDays(firstDayOfMonth, i);
      fortyTwoDays.push(previousDay);
    }
  }
  return fortyTwoDays;
};

const getDaysBeforeStart = (firstDayOfMonth: Date, sundayFirst: boolean) => {
  if (!sundayFirst) {
    return getDaysBeforeStartMonday(firstDayOfMonth);
  } else {
    return getDaysBeforeStartSunday(firstDayOfMonth);
  }
};

export const getFourtyTwoDays = (initMonth: number, initYear: number, sundayFirst: boolean) => {
  let fourtyTwoDays = [];
  let firstDayOfMonth = startOfMonth(new Date(initYear, initMonth, 1));
  let lastDayOfMonth = endOfMonth(firstDayOfMonth);

  fourtyTwoDays = getDaysBeforeStart(firstDayOfMonth, sundayFirst);
  // Add in all days this month
  for (let i = 0; i < getDaysInMonth(firstDayOfMonth); i++) {
    fourtyTwoDays.push(addDays(firstDayOfMonth, i));
  }
  // Add in all days at the end of the month until last day of week seen
  let toAdd = 1;
  let gotAllDays = false;
  while (!gotAllDays) {
    if (fourtyTwoDays.length >= 42) {
      gotAllDays = true;
      break;
    }
    fourtyTwoDays.push(addDays(lastDayOfMonth, toAdd));
    toAdd++;
  }
  return fourtyTwoDays;
};

export const isInbetweenDates = (isStartDate: boolean, dayToFindOut: Date, start: Date, end: Date) => {
  let isInBetweenDates;

  if (isStartDate) {
    isInBetweenDates = isAfter(dayToFindOut, start) && isBefore(dayToFindOut, end);
  } else {
    isInBetweenDates = isBefore(dayToFindOut, start) && isAfter(dayToFindOut, end);
  }

  return isInBetweenDates;
};

export const isValidTimeChange = (mode: Mode, date: Date, start: Date, end: Date) => {
  let modeStartAndDateSameOrBeforeStart = mode === 'start' && (isBefore(date, end) || isEqual(date, end));
  let modeEndAndDateSameOrAfterEnd = mode === 'end' && (isAfter(date, start) || isEqual(date, start));
  return modeStartAndDateSameOrBeforeStart || modeEndAndDateSameOrAfterEnd;
};
