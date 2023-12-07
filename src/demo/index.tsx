import { useState } from 'react';
import moment, { type Moment } from 'moment';
import ReactDateTimePicker from '../lib/index';
import { MomentDateRanges } from './consts';
import Header from './components/Header';

export default function Demo() {
  const [start, end] = MomentDateRanges['Today'];

  const [selectedRange, setSelectedRange] = useState({
    start,
    end,
  });

  function handleApply(startDate: Moment, endDate: Moment) {
    setSelectedRange({ start: startDate, end: endDate });
  }

  function getUserFriendlyDateRangeString() {
    const formattedSelectedStart = selectedRange.start.format('LLL');
    const formattedSelectedEnd = selectedRange.end.format('LLL');
    const formattedDateRange = `${formattedSelectedStart} to ${formattedSelectedEnd}`;

    return formattedDateRange;
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7x px-2 py-4 sm:px-6 lg:px-8">
        <p className="mb-5">Click on the button to display the date picker</p>
        <ReactDateTimePicker
          ranges={MomentDateRanges}
          start={selectedRange.start}
          end={selectedRange.end}
          years={[2020, new Date().getFullYear()]}
          locale={{
            format: 'DD-MM-YYYY HH:mm',
            sundayFirst: false,
          }}
          maxDate={moment(start)
            .add(24, 'hour')
            .set('hour', 23)
            .set('minute', 59)}
          applyCallback={handleApply}
          twelveHoursClock
          displayMaxDate
        >
          <button className="w-3/5 cursor-pointer rounded border bg-gray-50 px-3 py-2 text-left hover:border-gray-300">
            {getUserFriendlyDateRangeString()}
          </button>
        </ReactDateTimePicker>
      </div>
    </>
  );
}
