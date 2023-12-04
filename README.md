# 📦 React TailwindCSS Date and Time Picker

This is a feature rich React date-time picker component built with **React 18** and [Vitejs](https://vitejs.dev/) offering the following functionalities:

- ✅ Selection of date ranges
- ✅ Selection of times for the selected range
- ✅ Personalized range presets for faster selection (e.g.: Yesterday, last months etc.)
- ✅ Keyboard navigation for accessibility
- ✅ TypeScript support

This project is a fork of [react-datetimepicker](https://github.com/v0ltoz/react-datetimepicker) with **significant alterations** including:

- Complete revamp of CSS styles utilizing [TailwindCSS](https://tailwindcss.com/).
- Transition to [Vitejs](https://vitejs.dev/) for the build system.
- Conversion of all files to TypeScript for improved type safety and development efficiency.

<a href="https://github.com/microsoft/react-native-macos/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="React Native for macOS is released under the MIT license." />
  </a>
<a href="https://www.npmjs.com/package/react-tailwindcss-datetimepicker">
    <img src="https://img.shields.io/npm/dm/react-tailwindcss-datetimepicker.svg?style=flat-square" alt="Downloads" />
</a>

## Online Demo

**Check out the [online demo](https://codesandbox.io/p/github/mohsentaleb/react-tailwindcss-datetimepicker/master) at codesandbox.io**

![Date Time Picker](https://raw.githubusercontent.com/mohsentaleb/react-tailwindcss-datetimepicker/master/public/demo.gif)

## Table of Contents

- [Basic Setup](#basic-setup)
  * [With TailwindCSS](#with-tailwindcss)
  * [Without TailwindCSS](#without-tailwindcss)
- [Basic Usage](#basic-usage)
  * [Function Components](#function-components)
  * [Legacy Class Components](#legacy-class-components)
- [Component Props](#component-props)
- [Development](#development)
- [Production](#production)
- [Roadmap](#roadmap)
- [License](#license)

## Basic Setup

```bash
// Using npm
npm i react-tailwindcss-datetimepicker

// Using yarn
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
    // ^^^^^^^^^
    // Add this line
  ],
};
```

### Without TailwindCSS

The CSS file needed for this component is shipped in 

## Basic Usage

### Function Components

```ts
import { useState } from 'react';
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import moment, { type Moment } from 'moment-timezone';

function App() {
  const start = moment(new Date());
  const end = moment(start).add(1, 'days').subtract(1, 'seconds');
  const [range, setRange] = useState({start, end });

  function handleApply(startDate: Moment, endDate: Moment) {
    setRange({ start: startDate, end: endDate });
  }

  return (
    <DateTimePicker
      ranges={{
        Today: [moment(start), moment(end)],
        '1 Month': [moment(start).subtract(1, 'months'), moment(end)]
      }}
      start={range.start}
      end={range.end}
      local={{
        format: 'DD-MM-YYYY HH:mm',
        sundayFirst: false,
      }}
      maxDate={moment(start).add(24, 'hour')}
      applyCallback={handleApply}
    >
      <input
        placeholder="Enter date..."
        value={`${range.start} - ${range.end}`}
        disabled
      />
    </DateTimePicker>
  );
}

export default App;
```

### Legacy Class Components

<details>
  <summary>For implementing it in a legacy class component check out here</summary>

```ts
import React from 'react';
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import moment, { type Moment } from 'moment-timezone';

class App extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();
    const start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    const end = moment(start).add(1, 'days').subtract(1, 'seconds');
    this.state = {
      start: start,
      end: end,
    };
  }

  applyCallback = (startDate: Moment, endDate: Moment) => {
    this.setState({
      start: startDate,
      end: endDate,
    });
  }

  render() {
    const now = new Date();
    const start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    const end = moment(start).add(1, 'days').subtract(1, 'seconds');
    const ranges = {
      Today: [moment(start), moment(end)],
      '1 Month': [moment(start).subtract(1, 'months'), moment(end)],
    };
    const local = {
      format: 'DD-MM-YYYY HH:mm',
      sundayFirst: false,
    };
    let maxDate = moment(start).add(24, 'hour');
    return (
      <DateTimePicker
        ranges={ranges}
        start={this.state.start}
        end={this.state.end}
        local={local}
        maxDate={maxDate}
        applyCallback={this.applyCallback}
      >
        <input
          placeholder="Enter date..."
          value={`${range.start} - ${range.end}`}
          disabled
        />
      </DateTimePicker>
    );
  }
}

export default App;
```
  
</details>



## Component Props

### `ranges`

(Required)
`Record<string, [Moment, Moment]>`

A record of ranges defined using a tuple of Moment times.

```js
const ranges = {
  'Today': [moment(start), moment(end)],
  'Yesterday': [
    moment(start).subtract(1, 'days'),
    moment(end).subtract(1, 'days'),
  ],
  'Last 3 Days': [moment(start).subtract(3, 'days'), moment(end)],
};
```

### `start`

(Required)
`Moment`

Initial start Date set in the picker

### `end`

(Required)
`Moment`

Initial end Date set in the picker

### `local`

(Required)

Defines a locale format for date labels to be shown as. Can also set Sunday to be first day or Monday. Locale object has 2 required keys only:
- `format`: Moment [display format](https://momentjs.com/docs/#/parsing/special-formats/).
- `sundayFirst`: `true` if Sunday is the first day of the week. `false` if Monday is the first.

Example:

```ts
const locale = {
  // Mandatory
  format: 'DD-MM-YYYY HH:mm', // See: https://momentjs.com/docs/#/parsing/special-formats/
  sundayFirst: false,

  // Optional
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

### `applyCallback`

(Required) `(start: Moment, end: Moment) => void`

Function which is called when the apply button is clicked/pressed. Takes two params, start date and the end date which are both `Moment` dates.

### `rangeCallback`

(optional) `(index: number, value: keyof PresetDateRanges) => void`

Function which is called when one of the preset ranges is clicked/selected. Takes two params: 
- `index` is the index of item which is selected
- `value` is the label of that item

### `maxDate`

(optional) `Moment`

Maximum date that can be selected in calendar.


### `autoApply`

(optional)\*\* `boolean` defaults to `false`

When set there will only be one button in the bottom right to close the screen. With this set to `true` upon changing anything in picker the `callbackfunction` will be automatically called

### `descendingYears`

(optional) `boolean` defaults to `false`

To set years be displayed in descending order in picker instead of ascending.

### `years`

(optional) `[number, number]` defaults to `[1900, <currentYear>]`

Takes a tuple where the first value is the start year and the second values is the end year. This will update the dropdown years to only show these years.

**WARNING:** This does not affect the ability to type in years in the text box and go beyond the values set here.

Example:

```js
years={[1900, 2023]}
```

Takes an array where the first value is the start year and the second values is the end year. This will
update the dropdown years to only show these years.
<br> WARNING: This does not affect the ability to type in years in the text box and go beyond the values set here.

### `smartMode`

(optional) `boolean` defaults to `false`

The date time picker will switch the month on the right hand side (RHS) when two dates in the same month are selected. Can be used in
conjunction with `pastSearchFriendly` to switch the month on the left hand side (LHS) when the two dates are from the same month.

### `pastSearchFriendly`

(optional) `boolean`

**Note:** Requires `smartMode` to be enabled.

Changes the mode of the date time picker to be optimised for past searches. Where possible, the start and end time will be shown on the RHS when the month and year are equal. This allows for the previous month to be shown on the LHS to allow easier backwards searching.

This setting is `false` by default meaning that the LHS is used when dates are selected in the same month & year

### `darkMode`

(optional) `boolean` defaults to `false`

Changes the DateTimePicker to be in Dark Mode.

### `noMobileMode`

(optional) `boolean` defaults to `false`

When set the mobile breakpoint to be ignored. Picker will always be displayed in full screen mode.

### `forceMobileMode`

(optional) `boolean`

When set the mobile breakpoint to be ignored. Picker will always be displayed in full screen mode.

### `twelveHoursClock`

(optional) `boolean` defaults to `false`

When enabled, the picker will display time values in a 12-hour format rather than a 24-hour format.

### `standalone`

(optional) `boolean`

When set the picker will be open by default.

### `leftMode`

(optional) `boolean`

When set and changed the picker will open to the left (right to left) instead of the default which is to open to the right (left to right)

### `centerMode`

(optional) `boolean`

To allow flexibility, center mode has been added where leftMode or default is not enough.

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

Builds the app for production to the `/dist` folder using vite's [library mode](https://vitejs.dev/guide/build.html#library-mode). Type declarations are also created in the same directory.

## Roadmap

- [x] Support TypeScript
- [ ] The ability to add custom CSS classes for different parts of the component
- [ ] Migrate to [date-fns](https://www.npmjs.com/package/date-fns)
- [ ] Write more tests

## License

[MIT](/LICENSE.md)
