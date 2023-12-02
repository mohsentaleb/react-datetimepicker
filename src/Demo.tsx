import { useState } from 'react';
import moment, { type Moment } from 'moment-timezone';
import DateTimeRangeContainer from './lib/index';
import { MomentDateRanges } from './consts';

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
    <div className="mb-4 rounded-lg border p-4">
      <h2 className="text-2xl font-extrabold">Demo</h2>
      <p className="mb-10">Click on the input to display the date picker</p>
      <DateTimeRangeContainer
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
        // smartMode
      >
        <input
          id="inputsTextB"
          className="w-96 cursor-pointer rounded border bg-gray-50 p-2"
          type="text"
          placeholder="Enter text"
          style={{ cursor: 'pointer' }}
          alt={getUserFriendlyDateRangeString()}
          value={getUserFriendlyDateRangeString()}
          disabled
        />
      </DateTimeRangeContainer>
    </div>
  );
}
