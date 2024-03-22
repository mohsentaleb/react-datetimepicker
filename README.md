# 📦 React TailwindCSS Date and Time Picker

This is a feature rich React date-time picker component built with **React 18** and [Vitejs](https://vitejs.dev/) offering the following functionalities:

- ✅ Selection of date ranges
- ✅ Selection of times for the selected range
- ✅ Customizable range presets for faster selection (e.g.: Yesterday, last 30 days, etc.)
- ✅ Keyboard navigation for accessibility
- ✅ TypeScript support
- ✅ Out of the box dark mode support
- ✅ Fully responsive (Optimized for mobile devices)
- ✅ No date library dependency for implementation (You can use vanilla js, `date-fns`, `moment` etc)

<a href="https://github.com/mohsentaleb/react-tailwindcss-datetimepicker/blob/master/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="React Native for macOS is released under the MIT license." />
  </a>
<a href="https://www.npmjs.com/package/react-tailwindcss-datetimepicker">
    <img src="https://img.shields.io/npm/dm/react-tailwindcss-datetimepicker.svg?style=flat-square" alt="Downloads" />
</a>

## Online Demo

**Check out the [online demo](https://codesandbox.io/p/github/mohsentaleb/react-tailwindcss-datetimepicker/master) at codesandbox.io**

![Date Time Picker](https://raw.githubusercontent.com/mohsentaleb/react-tailwindcss-datetimepicker/master/public/demo.gif)

This project is a fork of [react-datetimepicker](https://github.com/v0ltoz/react-datetimepicker) with **significant alterations** including:

- Complete revamp of CSS styles utilizing [TailwindCSS](https://tailwindcss.com/).
- Transition to [Vitejs](https://vitejs.dev/) for the build system.
- Conversion of all files to TypeScript for improved type safety and development efficiency.

## Table of Contents

- [Installation](#installation)
  - [With TailwindCSS](#with-tailwindcss)
  - [Without TailwindCSS](#without-tailwindcss)
- [Basic Usage](#basic-usage)
  - [Function Components](#function-components)
  - [Legacy Class Components](#legacy-class-components)
- [Component Props](#component-props)
- [Development](#development)
- [Production](#production)
- [Migration](#migration)
  - [from `2.x.x to ` to `3.x.x`:](#from-2xx-to--to-3xx)
  - [From `1.x.x to ` to `2.x.x`:](#from-1xx-to--to-2xx)
- [Roadmap](#roadmap)
- [License](#license)

## Installation

```shell
// Npm
npm i react-tailwindcss-datetimepicker

// Yarn
yarn add react-tailwindcss-datetimepicker
```

### With TailwindCSS

If you're already including TailwindCSS in your project, just open up your `tailwind.config.js` file and add the following line to your `content` array so that tailwind could find CSS classes used in picker and add those to your project's global css file:

```js
// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwindcss-datetimepicker/dist/react-tailwindcss-datetimepicker.js',
    // Add this line 👆
  ],
};
```

### Without TailwindCSS

If you don't use TailwindCSS in your project you can simply import the shipped standalone CSS file needed for this component like so:

```tsx
// src/main.tsx

import DateTimePicker from 'react-tailwindcss-datetimepicker';
import 'react-tailwindcss-datetimepicker/style.css';
```

## Basic Usage

### Function Components

```ts
import { useState } from "react";
import DateTimePicker from "react-tailwindcss-datetimepicker";

// If you are already using TailwindCSS, you can omit this.
// Check out section "Installing With TailwindCSS" in docs.
import "react-tailwindcss-datetimepicker/style.css";

const now = new Date();
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date(startOfToday);
endOfToday.setDate(endOfToday.getDate() + 1);
endOfToday.setSeconds(endOfToday.getSeconds() - 1);

function App() {
  // Set the initial view of picker to last 2 days
  const [selectedRange, setSelectedRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    end: endOfToday,
  });

  function handleApply(startDate: Date, endDate: Date) {
    setSelectedRange({ start: startDate, end: endDate });
  }

  return (
    <DateTimePicker
      ranges={{
        Today: [new Date(startOfToday), new Date(endOfToday)],
        "Last 30 Days": [
          new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
            0,
            0,
            0,
            0
          ),
          new Date(endOfToday),
        ],
      }}
      start={selectedRange.start}
      end={selectedRange.end}
      applyCallback={handleApply}
    >
      <button type="button">{`${selectedRange.start} - ${selectedRange.end}`}</button>
    </DateTimePicker>
  );
}

export default App;
```

### Legacy Class Components

<details>
  <summary>For using it in a legacy class component check out the sample code here</summary>

```tsx
import React from 'react';
import DateTimePicker from 'react-tailwindcss-datetimepicker';

// If you are already using TailwindCSS, you can omit this.
// Check out section "Installing With TailwindCSS" in docs.
import 'react-tailwindcss-datetimepicker/style.css';

interface Props {}
interface State {
  start: Date;
  end: Date;
}

const now = new Date();
const startOfToday = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  0,
  0,
  0,
  0
);

const endOfToday = new Date(startOfToday);
endOfToday.setDate(endOfToday.getDate() + 1);
endOfToday.setSeconds(endOfToday.getSeconds() - 1);

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Set the initial view of picker to last 2 days
    this.state = {
      start: new Date(new Date().setDate(new Date().getDate() - 2)),
      end: endOfToday,
    };
  }

  applyCallback = (startDate: Date, endDate: Date) => {
    this.setState({
      start: startDate,
      end: endDate,
    });
  };

  render() {
    return (
      <DateTimePicker
        ranges={{
          Today: [new Date(startOfToday), new Date(endOfToday)],
          'Last 30 Days': [
            new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate(),
              0,
              0,
              0,
              0
            ),
            new Date(endOfToday),
          ],
        }}
        start={this.state.start}
        end={this.state.end}
        applyCallback={this.applyCallback}
        displayMaxDate
      >
        <button type="button">{`${this.state.start} - ${this.state.end}`}</button>
      </DateTimePicker>
    );
  }
}

export default App;
```

</details>

## Component Props

| Option                                      | Required     | Type       | Default       | Description                                                                    |
| ------------------------------------------- | ------------ | ---------- | ------------- | ------------------------------------------------------------------------------ |
| [`ranges`](#ranges)                         | **Required** | `Object`   | `undefined`   | A record of ranges defined as labels and a tuple of Date times.                |
| [`start`](#start)                           | **Required** | `Date`     | `undefined`   | Initial start Date set in the picker                                           |
| [`end`](#end)                               | **Required** | `Date`     | `undefined`   | Initial end Date set in the picker                                             |
| [`applyCallback`](#applycallback)           | **Required** | `Function` | `undefined`   | Function which is called when the apply button is clicked                      |
| [`locale`](#locale)                         | optional     | `Object`   | `undefined`   | locale format for translatable labels                                                  |
| [`rangeCallback`](#rangecallback)           | optional     | `Function` | `undefined`   | Function which is called when one of the preset ranges is clicked              |
| [`maxDate`](#maxdate)                       | optional     | `Date`     | `undefined`   | Maximum date that can be selected in calendar                                  |
| [`autoApply`](#autoapply)                   | optional     | `Boolean`  | `false`       | Set dates as soon as they're clicked without pressing apply                    |
| [`descendingYears`](#descendingyears)       | optional     | `Boolean`  | `false`       | Set years be displayed in descending order                                     |
| [`years`](#years)                           | optional     | `Array`    | `[1900, now]` | Limit the years shown in calendar                                              |
| [`smartMode`](#smartmode)                   | optional     | `Boolean`  | `false`       | Switch the month on the right hand side (RHS) when two dates in the same month |
| [`pastSearchFriendly`](#pastsearchfriendly) | optional     | `Boolean`  | `false`       | Optimize calendar for past searches                                            |
| [`noMobileMode`](#nomobilemode)             | optional     | `Boolean`  | `false`       | Picker will always be displayed in full screen mode                            |
| [`forceMobileMode`](#forcemobilemode)       | optional     | `Boolean`  | `false`       | Picker will always be displayed in condensed mode all the time                 |
| [`twelveHoursClock`](#twelvehoursclock)     | optional     | `Boolean`  | `false`       | Display time values in a 12-hour format rather than a 24-hour format           |
| [`standalone`](#standalone)                 | optional     | `Boolean`  | `false`       | When set the picker will be open by default                                    |
| [`leftMode`](#leftmode)                     | optional     | `Boolean`  | `false`       | Picker will open to the left                                                   |
| [`centerMode`](#centermode)                 | optional     | `Boolean`  | `false`       | Picker will open in center                                                     |
| [`displayMaxDate`](#displaymaxdate)         | optional     | `Boolean`  | `false`       | Will display Max Date in picker footer                                         |
| [`classNames`](#classnames)                 | optional     | `Object`   | `undefined`   | Will override classNames for different parts of the picker                     |

### `ranges`

(Required)
`Record<string, [Date, Date]>`

A record of ranges defined using a tuple of `Date` instances.

Using vanilla Javascript:

```js
const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date(startOfToday);
endOfToday.setDate(endOfToday.getDate() + 1);
endOfToday.setSeconds(endOfToday.getSeconds() - 1);

const ranges = {
  Today: [startOfToday, startOfToday],
  // 'Last 30 Days': [..., ...],
};
```

Or using [`date-fns`](https://date-fns.org/) lib:

```ts
import { add, sub, startOfDay } from 'date-fns';

const now = new Date();
const startOfToday = startOfDay(now);
const endOfToday = add(sub(startOfToday, { seconds: 1 }), { days: 1 });

const ranges = {
  Today: [startOfDay(startOfToday), endOfToday],
  'Last 30 Days': [startOfDay(sub(startOfToday, { days: 30 })), endOfToday],
};
```

### `start`

(Required)
`Date`

Initial start Date set in the picker

### `end`

(Required)
`Date`

Initial end Date set in the picker

### `applyCallback`

(Required) `(start: Date, end: Date) => void`

Function which is called when the apply button is clicked/pressed. Takes two params, start date and the end date.

### `locale`

(optional)

Locale for translatable labels. Can also set Sunday to be first day or Monday.

Example:

```ts
const locale = {
  format: 'dd-MM-yyyy HH:mm', // See: https://date-fns.org/v2.16.1/docs/format
  sundayFirst: false,
  days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'So'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  fromDate: 'From Date',
  toDate: 'To Date',
  selectingFrom: 'Selecting From',
  selectingTo: 'Selecting To',
  maxDate: 'Max Date',
  close: 'Close',
  apply: 'Apply',
  cancel: 'Cancel',
};
```

### `rangeCallback`

(optional) `(index: number, value: keyof PresetDateRanges) => void`

Function which is called when one of the preset ranges is clicked/selected. Takes two params:

- `index` is the index of item which is selected
- `value` is the label of that item

### `maxDate`

(optional) `Date`

Maximum date that can be selected in calendar.

### `autoApply`

(optional)\*\* `boolean` defaults to `false`

When set there will only be one button in the bottom right to close the screen. With this set to `true` upon changing anything in picker the `callbackfunction` will be automatically called

### `descendingYears`

(optional) `boolean` defaults to `false`

To set years be displayed in descending order in picker instead of ascending.

### `years`

(optional) `[number, number]` defaults to `[1900, new Date().getFullYear()]`

Takes a tuple where the first value is the start year and the second values is the end year users can pick from.

Example:

```js
years={[2000, 2025]}
```

### `smartMode`

(optional) `boolean` defaults to `false`

The date time picker will switch the month on the right hand side (RHS) when two dates in the same month are selected. Can be used in
conjunction with `pastSearchFriendly` to switch the month on the left hand side (LHS) when the two dates are from the same month.

### `pastSearchFriendly`

(optional) `boolean`

**Note:** Requires `smartMode` to be enabled.

Changes the mode of the date time picker to be optimised for past searches. Where possible, the start and end time will be shown on the RHS when the month and year are equal. This allows for the previous month to be shown on the LHS to allow easier backwards searching.

This setting is `false` by default meaning that the LHS is used when dates are selected in the same month & year

### `noMobileMode`

(optional) `boolean` defaults to `false`

When set the mobile breakpoint to be ignored. Picker will always be displayed in full screen mode.

### `forceMobileMode`

(optional) `boolean` defaults to `false`

When set the mobile breakpoint to be ignored. Picker will always be displayed in condensed mode all the time.

### `twelveHoursClock`

(optional) `boolean` defaults to `false`

When enabled, the picker will display time values in a 12-hour format rather than a 24-hour format.

### `standalone`

(optional) `boolean` defaults to `false`

When set the picker will be open by default.

### `leftMode`

(optional) `boolean` defaults to `true`

When set and changed the picker will open to the left (right to left) instead of the default which is to open to the right (left to right)

### `centerMode`

(optional) `boolean` defaults to `false`

To allow flexibility, center mode has been added where leftMode or default is not enough.

### `displayMaxDate`

(optional) `boolean` defaults to `false`

To allow flexibility, center mode has been added where leftMode or default is not enough.

### `classNames`

(optional) `object`

Will add extra classNames to different parts of the picker. It's great for for tailoring the component to match your preferred look and feel. The object has the following keys:

- `rootContainer`
- `rangesContainer`
- `rangeButtonDefault`
- `rangeButtonSelected`
- `fromToRangeContainer`
- `normalCell`
- `normalCellHove`
- `greyCel`
- `invalidCel`
- `startCel`
- `endCel`
- `withinRangeCel`
- `startDot`
- `endDot`
- `footerContainer`
- `applyButton`
- `cancelButton`

By providing CSS `className`(s) for these keys, you can customize/override them.

**Note:** If you're already using TailwindCSS in your project, you can use the `!` operand for overriding an already exisiting className. (Just like `!important` in regular CSS) For example:

```tsx
classNames={{
  rootContainer: '!bg-red-700'
}}
```
The following illustration shows the different components of the picker which can be customized:

![Date Time Picker Components Illustration](https://raw.githubusercontent.com/mohsentaleb/react-tailwindcss-datetimepicker/master/public/date-picker-illustration.png)

## Development

Runs the app in the development mode.

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Hot module reloading** is enabled in dev mode.

## Production

```
npm run build
```

Builds the app for production to the `/dist` folder using vite's [library mode](https://vitejs.dev/guide/build.html#library-mode). Type declarations (`index.d.ts`) are also created in the same directory.

## Migration

### from `2.x.x to ` to `3.x.x`:

- [`Moment`](https://momentjs.com/) has been removed from the dependencies. Now you can use any date library (or even vanilla js) to construct your date objects. See [`ranges`](#ranges).

### From `1.x.x to ` to `2.x.x`:

- `local` prop has been renamed to [`locale`](#locale) and it's now an **optional** prop.
- `style` prop has been removed in favor of [`classNames`](#classnames).
- `darkMode` prop has been removed. All UI elements of the picker now have dark styles defined for them. If you add `className=dark` to your `<body>` tag (or any other parent element of it), dark mode will be automatically turned on.

## Roadmap

- [x] Support TypeScript
- [x] Ability to add custom CSS classes for different parts of the component
- [x] Migrate to [date-fns](https://www.npmjs.com/package/date-fns)
- [x] Adding predefined themes
- [ ] More demos showcasing different props
- [ ] Write tests

## License

[MIT](https://github.com/mohsentaleb/react-tailwindcss-datetimepicker/blob/master/LICENSE.md)
