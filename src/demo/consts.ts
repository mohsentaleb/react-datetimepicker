import moment from 'moment-timezone';
import { PresetDateRanges } from '../lib/types';

const now = new Date();
const start = moment(
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
);
const end = moment(start).add(1, 'days').subtract(1, 'seconds');

export const MomentDateRanges: PresetDateRanges = {
  Today: [moment(start), moment(end)],
  Yesterday: [
    moment(start).subtract(1, 'days'),
    moment(end).subtract(1, 'days'),
  ],
  'Last 3 Days': [moment(start).subtract(3, 'days'), moment(end)],
  'Last 1 Week': [moment(start).subtract(7, 'days'), moment(end)],
  'Last 2 Weeks': [moment(start).subtract(14, 'days'), moment(end)],
  'Last 3 Weeks': [moment(start).subtract(21, 'days'), moment(end)],
  'Last Month': [moment(start).subtract(1, 'months'), moment(end)],
  'Last 2 Months': [moment(start).subtract(2, 'months'), moment(end)],
  'Last 3 Months': [moment(start).subtract(3, 'months'), moment(end)],
  'Last 6 Months': [moment(start).subtract(6, 'months'), moment(end)],
};
