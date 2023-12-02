import React from 'react';
import { addFocusStyle, darkTheme, lightTheme } from '../utils/StyleUtils';

import ChevronRightIcon from '../icons/chevron-right.svg?react';
import ChevronLeftIcon from '../icons/chevron-left.svg?react';
import { Mode } from '../types';
import type { BaseSyntheticEvent } from 'react';

interface Props {
  months: string[];
  years: number[];
  month: number;
  year: number;
  changeMonthCallback: (event: BaseSyntheticEvent) => void;
  changeYearCallback: (event: BaseSyntheticEvent) => void;
  changeMonthArrowsCallback: (
    isPreviousChange: boolean,
    isNextChange: boolean
  ) => void;
  darkMode?: boolean;
  mode: Mode;
}

interface State {
  monthFocus: boolean;
  yearFocus: boolean;
}

export default class MonthYearSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      monthFocus: false,
      yearFocus: false,
    };

    this.monthFocus = this.monthFocus.bind(this);
    this.yearFocus = this.yearFocus.bind(this);
    this.monthBlur = this.monthBlur.bind(this);
    this.yearBlur = this.yearBlur.bind(this);
  }

  createCalendarMonths(months: string[]) {
    return this.mapToOption(months);
  }

  createYears(years: number[]) {
    return this.mapToOption(years);
  }

  monthFocus() {
    this.setState({ monthFocus: true });
  }

  monthBlur() {
    this.setState({ monthFocus: false });
  }

  yearFocus() {
    this.setState({ yearFocus: true });
  }

  yearBlur() {
    this.setState({ yearFocus: false });
  }

  mapToOption(variableArray: number[] | string[]) {
    return variableArray.map(function (varInstance, i) {
      return <option key={i}>{varInstance}</option>;
    });
  }

  render() {
    let months = this.createCalendarMonths(this.props.months);
    let years = this.createYears(this.props.years);
    let theme = this.props.darkMode ? darkTheme : lightTheme;
    let monthFocusStyle = {};
    monthFocusStyle = addFocusStyle(this.state.monthFocus, monthFocusStyle);
    let yearFocusStyle = {};
    yearFocusStyle = addFocusStyle(this.state.yearFocus, yearFocusStyle);

    return (
      <div className="m-1 mt-2 flex items-center">
        <div className="grow text-left">
          <ChevronLeftIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => this.props.changeMonthArrowsCallback(true, false)}
          />
        </div>
        <div
          className="grow"
          onFocus={this.monthFocus}
          onBlur={this.monthBlur}
          style={monthFocusStyle}
        >
          <select
            id={'MonthSelector_' + this.props.mode}
            value={this.props.months[this.props.month]}
            onChange={this.props.changeMonthCallback}
            style={theme}
            className="rounded border border-gray-200 p-1"
          >
            {months}
          </select>
        </div>
        <div
          className="grow"
          onFocus={this.yearFocus}
          onBlur={this.yearBlur}
          style={yearFocusStyle}
        >
          <select
            id={'YearSelector_' + this.props.mode}
            value={this.props.year}
            onChange={this.props.changeYearCallback}
            style={theme}
            className="rounded border border-gray-200 p-1"
          >
            {years}
          </select>
        </div>
        <div className="inline-block text-right">
          <ChevronRightIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => this.props.changeMonthArrowsCallback(false, true)}
          />
        </div>
      </div>
    );
  }
}
