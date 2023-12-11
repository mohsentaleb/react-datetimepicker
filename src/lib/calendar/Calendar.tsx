import React from 'react';

import { isEqual, format } from 'date-fns';
import MonthYearSelector from './MonthYearSelector';
import CalendarHeader from './CalendarHeader';
import CalendarRows from './CalendarRows';
import { createYears } from '../utils/YearUtils';
import {
  getMonth,
  getYear,
  getFourtyTwoDays,
} from '../utils/TimeFunctionUtils';

import type { ClassNames, Locale, Mode } from '../types';
import type { BaseSyntheticEvent } from 'react';

interface Props {
  date: Date;
  mode: Mode;
  otherDate: Date;
  maxDate?: Date;
  dateSelectedNoTimeCallback: (cellDate: Date, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Date, newDate: Date) => boolean;
  focusOnCallback: (date: Date | boolean) => void;
  focusDate: boolean | Date;
  descendingYears?: boolean;
  years?: [number, number];
  pastSearchFriendly?: boolean;
  smartMode?: boolean;
  cellFocusedCallback: (date: Date) => void;
  locale?: Locale;
  classNames?: ClassNames;
}

interface State {
  month: number;
  year: number;
}

export default class Calendar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      month: 0,
      year: 0,
    };
  }

  componentDidMount() {
    this.updateMonthYear();
  }

  componentDidUpdate(previousProps: Props) {
    const isDifferentMomentObject =
      !isEqual(previousProps.date, this.props.date) ||
      !isEqual(previousProps.otherDate, this.props.otherDate);
    const isDifferentTime =
      format(this.props.date, 'dd-MM-yyyy HH:mm') !==
        format(previousProps.date, 'dd-MM-yyyy HH:mm') ||
      format(this.props.otherDate, 'dd-MM-yyyy HH:mm') !==
        format(previousProps.otherDate, 'dd-MM-yyyy HH:mm');
    if (isDifferentMomentObject || isDifferentTime) {
      this.updateMonthYear();
    }
  }

  updateMonthYear() {
    let newMonth = getMonth(
      this.props.date,
      this.props.otherDate,
      this.props.mode,
      this.props.pastSearchFriendly,
      this.props.smartMode
    );
    let newYear = getYear(
      this.props.date,
      this.props.otherDate,
      this.props.mode,
      this.props.pastSearchFriendly,
      this.props.smartMode
    );
    this.setState({
      month: newMonth,
      year: newYear,
    });
  }

  createMonths(locale?: Locale) {
    if (locale?.months) {
      return locale.months;
    }
    let months = [
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
    ];
    return months;
  }

  changeMonthCallback = (event: BaseSyntheticEvent) => {
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].value === event.target.value) {
        this.setState({ month: i });
      }
    }
  };

  changeMonthArrowsCallback = (
    isPreviousChange: boolean,
    isNextChange: boolean
  ) => {
    let years = createYears(this.props.years, this.props.descendingYears);
    let monthLocale = this.state.month;
    let yearLocale = this.state.year;

    let newMonthYear = { monthLocal: 0, yearLocal: 0 };
    if (isPreviousChange) {
      newMonthYear = this.getPreviousMonth(monthLocale, yearLocale, years);
    }
    if (isNextChange) {
      newMonthYear = this.getNextMonth(monthLocale, yearLocale, years);
    }

    this.setState({
      year: newMonthYear.yearLocal,
      month: newMonthYear.monthLocal,
    });
  };

  getPreviousMonth(monthLocale: number, yearLocale: number, years: number[]) {
    let isStartOfMonth = monthLocale === 0;
    let isFirstYear = yearLocale === years[0];

    if (!(isStartOfMonth && isFirstYear)) {
      if (monthLocale === 0) {
        monthLocale = 11;
        yearLocale -= 1;
      } else {
        monthLocale -= 1;
      }
    }
    return { monthLocal: monthLocale, yearLocal: yearLocale };
  }

  getNextMonth(monthLocale: number, yearLocale: number, years: number[]) {
    let isEndOfMonth = monthLocale === 11;
    let isLastYear = yearLocale === years[years.length - 1];
    if (!(isEndOfMonth && isLastYear)) {
      if (monthLocale === 11) {
        monthLocale = 0;
        yearLocale += 1;
      } else {
        monthLocale += 1;
      }
    }
    return { monthLocal: monthLocale, yearLocal: yearLocale };
  }

  changeYearCallback = (event: BaseSyntheticEvent) => {
    this.setState({ year: parseInt(event.target.value) });
  };

  render() {
    let months = this.createMonths(this.props.locale);
    let years = createYears(this.props.years, this.props.descendingYears);
    let headers = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    let sundayFirst = false;
    if (this.props.locale) {
      if (this.props.locale.days) {
        headers = this.props.locale.days;
      }
      if (this.props.locale.sundayFirst) {
        sundayFirst = true;
        const lastDay = headers.pop();
        if (lastDay !== undefined) {
          headers = [lastDay, ...headers];
        }
      }
    }

    let fourtyTwoDays = getFourtyTwoDays(
      this.state.month,
      this.state.year,
      sundayFirst
    );
    return (
      <div>
        <MonthYearSelector
          months={months}
          years={years}
          month={this.state.month}
          year={this.state.year}
          mode={this.props.mode}
          changeMonthCallback={this.changeMonthCallback}
          changeYearCallback={this.changeYearCallback}
          changeMonthArrowsCallback={this.changeMonthArrowsCallback}
        />
        <CalendarHeader headers={headers} />
        <CalendarRows
          fourtyTwoDays={fourtyTwoDays}
          date={this.props.date}
          mode={this.props.mode}
          otherDate={this.props.otherDate}
          maxDate={this.props.maxDate}
          month={this.state.month}
          year={this.state.year}
          dateSelectedNoTimeCallback={this.props.dateSelectedNoTimeCallback}
          keyboardCellCallback={this.props.keyboardCellCallback}
          focusOnCallback={this.props.focusOnCallback}
          focusDate={this.props.focusDate}
          cellFocusedCallback={this.props.cellFocusedCallback}
          smartMode={this.props.smartMode}
          classNames={this.props.classNames}
        />
      </div>
    );
  }
}
