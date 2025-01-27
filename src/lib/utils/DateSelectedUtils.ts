import {
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  isEqual,
  addDays,
  subDays,
  isAfter,
  isSameDay,
  getHours,
  getMinutes,
  getSeconds,
} from 'date-fns';

export const datePicked = (startDate: Date, endDate: Date, newDate: Date, startMode: boolean, smartMode?: boolean) => {
  if (startMode) {
    return newDateStartMode(newDate, endDate, startDate, smartMode);
  } else {
    return newDateEndMode(newDate, startDate, endDate, smartMode);
  }
};

const newDateStartMode = (newDate: Date, endDate: Date, startDate: Date, smartMode?: boolean) => {
  // Create a new moment object which combines the new date and the original start date as newDate
  // doesnt contain time info which is important to determining equality
  let newDateWithTime = createNewDateWithTime(
    newDate,
    getHours(startDate),
    getMinutes(startDate),
    getSeconds(startDate)
  );

  if (isBefore(newDateWithTime, endDate) || isEqual(newDateWithTime, endDate)) {
    return returnDateObject(newDate, endDate);
  } else if (smartMode) {
    const newEnd = addDays(newDate, 1);
    return returnDateObject(newDate, newEnd);
  } else {
    return returnDateObject(startDate, endDate);
  }
};

const newDateEndMode = (newDate: Date, startDate: Date, endDate: Date, smartMode?: boolean) => {
  // Create a new moment object which combines the new date and the original end date as newDate
  // doesnt contain time info which is important to determining equality
  let newDateWithTime = createNewDateWithTime(newDate, getHours(endDate), getMinutes(endDate), getSeconds(endDate));
  if (isAfter(newDateWithTime, startDate) || isEqual(newDateWithTime, startDate)) {
    return returnDateObject(startDate, newDate);
  } else if (smartMode) {
    let newStart = subDays(newDate, 1);
    return returnDateObject(newStart, newDate);
  } else {
    return returnDateObject(startDate, endDate);
  }
};

const createNewDateWithTime = (newDate: Date, hour: number, minute: number, second: number) => {
  const updatedDate = setSeconds(setMinutes(setHours(newDate, hour), minute), second);
  return updatedDate;
};

const returnDateObject = (startDate: Date, endDate: Date) => {
  return {
    startDate,
    endDate,
  };
};

export const pastMaxDate = (currentDate: Date, maxDate?: Date, minuteMode?: boolean): boolean => {
  if (!maxDate) {
    return false;
  }

  if (minuteMode && maxDate && isAfter(currentDate, maxDate)) {
    return true;
  }

  if (maxDate && !isSameDay(currentDate, maxDate) && isAfter(currentDate, maxDate)) {
    return true;
  }
  return false;
};

export const beforeMinDate = (currentDate: Date, minDate?: Date, minuteMode?: boolean): boolean => {
  if (!minDate) {
    return false;
  }

  if (minuteMode && minDate && isBefore(currentDate, minDate)) {
    return true;
  }

  if (minDate && !isSameDay(currentDate, minDate) && isBefore(currentDate, minDate)) {
    return true;
  }
  return false;
};
