import { useState } from 'react';
import moment, { type Moment } from 'moment-timezone';
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
    const formattedDateRange = `${formattedSelectedStart} - ${formattedSelectedEnd}`;

    return formattedDateRange;
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-4">
        <p className="mb-5">Click on the input to display the date picker</p>
        <ReactDateTimePicker
          ranges={MomentDateRanges}
          start={selectedRange.start}
          end={selectedRange.end}
          years={[2020, new Date().getFullYear()]}
          local={{
            format: 'DD-MM-YYYY HH:mm',
            sundayFirst: false,
          }}
          maxDate={moment(start).add(24, 'hour')}
          applyCallback={handleApply}
        >
          <input
            id="inputsTextB"
            className="w-3/5 cursor-pointer rounded border bg-gray-50 p-2"
            type="text"
            placeholder="Enter text"
            style={{ cursor: 'pointer' }}
            alt={getUserFriendlyDateRangeString()}
            value={getUserFriendlyDateRangeString()}
            disabled
          />
        </ReactDateTimePicker>
      </div>
    </>
  );
}
