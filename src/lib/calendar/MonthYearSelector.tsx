import React from 'react';

import ChevronRightIcon from '../icons/chevron-right.svg?react';
import ChevronLeftIcon from '../icons/chevron-left.svg?react';
import { Mode } from '../types';
import type { BaseSyntheticEvent } from 'react';
import clsx from 'clsx';

interface Props {
  months: string[];
  years: number[];
  month: number;
  year: number;
  changeMonthCallback: (event: BaseSyntheticEvent) => void;
  changeYearCallback: (event: BaseSyntheticEvent) => void;
  changeMonthArrowsCallback: (isPreviousChange: boolean, isNextChange: boolean) => void;
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

    return (
      <div className="m-2 flex items-center gap-1">
        <div className="grow text-left">
          <ChevronLeftIcon
            className="size-7 cursor-pointer rounded p-2 hover:bg-gray-100"
            onClick={() => this.props.changeMonthArrowsCallback(true, false)}
          />
        </div>
        <div className="shrink text-center">
          <select
            id={'MonthSelector_' + this.props.mode}
            value={this.props.months[this.props.month]}
            onChange={this.props.changeMonthCallback}
            className={clsx('rounded border border-gray-200 p-1 dark:border-slate-500 dark:bg-slate-600', {
              'ring-2 ring-offset-2': this.state.monthFocus,
            })}
            onFocus={this.monthFocus}
            onBlur={this.monthBlur}
          >
            {months}
          </select>
        </div>
        <div className="shrink text-center">
          <select
            id={'YearSelector_' + this.props.mode}
            value={this.props.year}
            onChange={this.props.changeYearCallback}
            className={clsx('rounded border border-gray-200 p-1 dark:border-slate-500 dark:bg-slate-600', {
              'ring-2 ring-offset-2': this.state.yearFocus,
            })}
            onFocus={this.yearFocus}
            onBlur={this.yearBlur}
          >
            {years}
          </select>
        </div>
        <div className="grow text-right ">
          <ChevronRightIcon
            className="size-7 cursor-pointer rounded p-2 hover:bg-gray-100"
            onClick={() => this.props.changeMonthArrowsCallback(false, true)}
          />
        </div>
      </div>
    );
  }
}
