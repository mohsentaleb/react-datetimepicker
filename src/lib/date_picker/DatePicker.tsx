import React from 'react';
import Label from './Label';
import DateField from './DateField';
import TimeField from './TimeField';
import Calendar from '../calendar/Calendar';
import ActiveNotifier from './ActiveNotifier';

import type { Moment } from 'moment';
import type { ClassNames, Locale, Mode } from '../types';
import clsx from 'clsx';

interface Props {
  locale: Locale;
  date: Moment;
  otherDate: Moment;
  mode: Mode;
  maxDate?: Moment;
  dateSelectedNoTimeCallback: (cellDate: Moment, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Moment, newDate: Moment) => boolean;
  cellFocusedCallback: (date: Moment) => void;
  focusOnCallback: (date: Moment | boolean) => void;
  focusDate: boolean | Moment;
  selectingModeFrom: boolean;
  timeChangeCallback: (newHour: number, newMinute: number, mode: Mode) => void;
  changeSelectingModeCallback: (selectingModeFromParam: boolean) => void;
  onChangeDateTextHandlerCallback: (newValue: string, mode: Mode) => void;
  dateTextFieldCallback: (mode: Mode) => void;
  dateLabel: string;
  label: string;
  descendingYears?: boolean;
  years?: [number, number];
  pastSearchFriendly?: boolean;
  smartMode?: boolean;
  twelveHoursClock?: boolean;
  classNames?: ClassNames;
}

export default class DatePicker extends React.Component<Props> {
  render() {
    const identifier = this.props.label
      .toLocaleLowerCase()
      .split(' ')
      .join('-');
    return (
      <div
        className={clsx(
          'w-full text-sm md:w-72',
          this.props.classNames?.fromToRangeContainer
        )}
        id={`datepicker-${identifier}`}
      >
        <div
          id={`datepicker-hour-container-${identifier}`}
          className="rounded border p-2 dark:border-slate-600"
        >
          <Label label={this.props.label} />
          <DateField
            // date={moment(this.props.date)}
            dateTextFieldCallback={this.props.dateTextFieldCallback}
            onChangeDateTextHandlerCallback={
              this.props.onChangeDateTextHandlerCallback
            }
            dateLabel={this.props.dateLabel}
            mode={this.props.mode}
            changeSelectingModeCallback={this.props.changeSelectingModeCallback}
            classNames={this.props.classNames}
          />
          <TimeField
            date={this.props.date}
            timeChangeCallback={this.props.timeChangeCallback}
            mode={this.props.mode}
            twelveHoursClock={this.props.twelveHoursClock}
            classNames={this.props.classNames}
          />
        </div>
        <Calendar
          date={this.props.date}
          mode={this.props.mode}
          otherDate={this.props.otherDate}
          maxDate={this.props.maxDate}
          dateSelectedNoTimeCallback={this.props.dateSelectedNoTimeCallback}
          keyboardCellCallback={this.props.keyboardCellCallback}
          focusOnCallback={this.props.focusOnCallback}
          focusDate={this.props.focusDate}
          cellFocusedCallback={this.props.cellFocusedCallback}
          locale={this.props.locale}
          descendingYears={this.props.descendingYears}
          years={this.props.years}
          pastSearchFriendly={this.props.pastSearchFriendly}
          smartMode={this.props.smartMode}
          classNames={this.props.classNames}
        />
        <ActiveNotifier
          selectingModeFrom={this.props.selectingModeFrom}
          mode={this.props.mode}
          smartMode={this.props.smartMode}
          locale={this.props.locale}
          classNames={this.props.classNames}
        />
      </div>
    );
  }
}
