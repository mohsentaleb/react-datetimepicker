import moment from 'moment';
import type { Moment } from 'moment';

export const datePicked = (
  startDate: Moment,
  endDate: Moment,
  newDate: Moment,
  startMode: boolean,
  smartMode?: boolean
) => {
  if (startMode) {
    return newDateStartMode(newDate, endDate, startDate, smartMode);
  } else {
    return newDateEndMode(newDate, startDate, endDate, smartMode);
  }
};

const newDateStartMode = (
  newDate: Moment,
  endDate: Moment,
  startDate: Moment,
  smartMode?: boolean
) => {
  // Create a new moment object which combines the new date and the original start date as newDate
  // doesnt contain time info which is important to determining equality
  let newDateWithTime = createNewDateWithTime(
    newDate,
    startDate.hour(),
    startDate.minute(),
    startDate.second()
  );
  if (newDateWithTime.isSameOrBefore(endDate, 'seconds')) {
    return returnDateObject(newDate, endDate);
  } else if (smartMode) {
    let newEnd = moment(newDate);
    newEnd.add(1, 'days');
    return returnDateObject(newDate, newEnd);
  } else {
    return returnDateObject(startDate, endDate);
  }
};

const newDateEndMode = (
  newDate: Moment,
  startDate: Moment,
  endDate: Moment,
  smartMode?: boolean
) => {
  // Create a new moment object which combines the new date and the original end date as newDate
  // doesnt contain time info which is important to determining equality
  let newDateWithTime = createNewDateWithTime(
    newDate,
    endDate.hour(),
    endDate.minute(),
    endDate.second()
  );
  if (newDateWithTime.isSameOrAfter(startDate, 'seconds')) {
    return returnDateObject(startDate, newDate);
  } else if (smartMode) {
    let newStart = moment(newDate);
    newStart.subtract(1, 'days');
    return returnDateObject(newStart, newDate);
  } else {
    return returnDateObject(startDate, endDate);
  }
};

const createNewDateWithTime = (
  newDate: Moment,
  hour: number,
  minute: number,
  second: number
) => {
  let newDateTmp = [newDate.year(), newDate.month(), newDate.date()];
  let newDateWithTime = moment(newDateTmp);
  newDateWithTime.hour(hour);
  newDateWithTime.minute(minute);
  newDateWithTime.second(second);
  return newDateWithTime;
};

const returnDateObject = (startDate: Moment, endDate: Moment) => {
  return {
    startDate,
    endDate,
  };
};

export const pastMaxDate = (
  currentDate: Moment,
  maxDate?: Moment,
  minuteMode?: boolean
) => {
  if (!maxDate) {
    return false;
  }
  if (minuteMode && maxDate && currentDate.isAfter(maxDate, 'seconds')) {
    return true;
  }
  if (maxDate && currentDate.isAfter(maxDate, 'day')) {
    return true;
  }
  return false;
};
