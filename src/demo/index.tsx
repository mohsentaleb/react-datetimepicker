import { useState } from 'react';
import ReactDateTimePicker from '../lib/index';
import { DateRanges } from './consts';
import Header from './components/Header';
import { add, set, format } from 'date-fns';
import type { Theme } from '../lib/types';

export default function Demo() {
  const [standaloneMode, setStandaloneMode] = useState(true);
  const [twelveHoursClock, setTwelveHoursClock] = useState(true);
  const [theme, setTheme] = useState<Theme>();
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
      <div className="max-w-7xl container mx-auto px-2 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row py-4 gap-5">
          <main role="main" className="w-full xl:w-2/3">
            {!standaloneMode && <p className="mb-5">Click on the button to display the date picker</p>}
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
              twelveHoursClock={twelveHoursClock}
              displayMaxDate
              theme={theme}
              standalone={standaloneMode}
            >
              <button className="w-3/5 cursor-pointer rounded border bg-gray-50 px-3 py-2 text-left hover:border-gray-300">
                {getUserFriendlyDateRangeString()}
              </button>
            </ReactDateTimePicker>
          </main>
          <aside className="w-full rounded-xl border px-2 xl:w-1/3">
            <div className="sticky top-0 w-full p-4">
              <h2 className="mb-5 text-xl font-bold">Options</h2>
              <div className="flex flex-col gap-5">
                <div className="flex">
                  <label className="w-full font-bold md:w-2/3">
                    Standalone Mode{' '}
                    <p className="text-sm font-normal text-gray-400">
                      Calendar is always shown without clicking on a button
                    </p>
                  </label>
                  <div className="flex w-full justify-end md:w-1/3">
                    <label className="inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={standaloneMode}
                        className="peer sr-only"
                        onChange={() => setStandaloneMode((state) => !state)}
                      />
                      <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                    </label>
                  </div>
                </div>
                <div className="flex">
                  <label className="w-full font-bold md:w-1/3">12 Hours Clock </label>
                  <div className="flex w-full justify-end md:w-2/3">
                    <label className="inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={twelveHoursClock}
                        className="peer sr-only"
                        onChange={() => setTwelveHoursClock((state) => !state)}
                      />
                      <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                    </label>
                  </div>
                </div>
                <div className="flex">
                  <label className="w-full font-bold md:w-1/3">Theme</label>
                  <div className="flex w-full flex-wrap justify-end gap-2 md:w-2/3">
                    <button
                      type="button"
                      className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-900 dark:text-sky-300"
                      onClick={() => setTheme('blue')}
                    >
                      Default (Blue)
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-700 dark:text-emerald-300"
                      onClick={() => setTheme('green')}
                    >
                      Green
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                      onClick={() => setTheme('orange')}
                    >
                      Orange
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      onClick={() => setTheme('purple')}
                    >
                      Purple
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
