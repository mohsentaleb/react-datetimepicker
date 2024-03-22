import { add, startOfDay, sub, startOfMonth, endOfMonth } from 'date-fns';
import { PresetDateRanges } from '../lib/types';

const now = new Date();
const start = startOfDay(now);
const end = add(sub(start, { seconds: 1 }), { days: 1 });

export const DateRanges: PresetDateRanges = {
  Today: [startOfDay(start), end],
  Yesterday: [startOfDay(sub(start, { days: 1 })), sub(end, { days: 1 })],
  'Last 5 Days': [startOfDay(sub(start, { days: 5 })), end],
  'Last 1 Week': [startOfDay(sub(start, { days: 7 })), end],
  'Last 3 Weeks': [startOfDay(sub(start, { days: 21 })), end],
  'Last Month': [startOfMonth(sub(start, { months: 1 })), endOfMonth(sub(start, { months: 1 }))],
  'Last 2 Months': [startOfMonth(sub(start, { months: 2 })), endOfMonth(sub(start, { months: 1 }))],
  'Last 3 Months': [startOfMonth(sub(start, { months: 3 })), endOfMonth(sub(start, { months: 1 }))],
};
