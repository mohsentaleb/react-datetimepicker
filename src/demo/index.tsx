import { useState } from 'react';
import ReactDateTimePicker from '../lib/index';
import { DateRanges } from './consts';
import Header from './components/Header';
import { add, set, format } from 'date-fns';

export default function Demo() {
  const [start, end] = DateRanges['Last 5 Days'];
  const [selectedRange, setSelectedRange] = useState({
    start,
    end,
  });

  function handleApply(startDate: Date, endDate: Date) {
    setSelectedRange({ start: startDate, end: endDate });
  }

  function getUserFriendlyDateRangeString() {
    const formattedSelectedStart = format(selectedRange.start, 'MMM d, yyyy h:mm a');
    const formattedSelectedEnd = format(selectedRange.end, 'MMM d, yyyy h:mm a');
    const formattedDateRange = `${formattedSelectedStart} to ${formattedSelectedEnd}`;

    return formattedDateRange;
  }

  return (
    <>
      <Header />
      <div className="max-w-7x mx-auto px-2 py-4 sm:px-6 lg:px-8">
        <p className="mb-5">Click on the button to display the date picker</p>
        <ReactDateTimePicker
          ranges={DateRanges}
          start={selectedRange.start}
          end={selectedRange.end}
          years={[2020, new Date().getFullYear()]}
          maxDate={set(add(end, { days: 1 }), {
            hours: 23,
            minutes: 59,
            seconds: 59,
          })}
          applyCallback={handleApply}
          twelveHoursClock
          displayMaxDate
          // theme='green'
          standalone
        >
          <button className="w-3/5 cursor-pointer rounded border bg-gray-50 px-3 py-2 text-left hover:border-gray-300">
            {getUserFriendlyDateRangeString()}
          </button>
        </ReactDateTimePicker>
      </div>
    </>
  );
}
