import React from 'react';
import Label from './Label';
import DateField from './DateField';
import TimeField from './TimeField';
import Calendar from '../calendar/Calendar';
import ActiveNotifier from './ActiveNotifier';

import type { Moment } from 'moment-timezone';
import type { Locale, Mode, Style } from '../types';

interface Props {
  local: Locale;
  date: Moment;
  otherDate: Moment;
  mode: Mode;
  maxDate?: Moment;
  // applyCallback: PropTypes.func.isRequired,
  dateSelectedNoTimeCallback: (cellDate: Moment, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Moment, newDate: Moment) => boolean;
  cellFocusedCallback: (date: Moment) => void;
  focusOnCallback: (date: Moment | boolean) => void;
  focusDate: boolean | Moment;
  selectingModeFrom: boolean;
  // changeVisibleState: PropTypes.func,
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
  // enableButtons: boolean,
  // autoApply: boolean,
  style?: Style;
  darkMode?: boolean;
  // standalone: boolean,
  twelveHoursClock?: boolean;
}

export default class DatePicker extends React.Component<Props> {
  render() {
    return (
      <div className="fromDateTimeContainer m-1 w-72 text-sm">
        <div className="fromDateHourContainer rounded border p-2">
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
            darkMode={this.props.darkMode}
          />
          <TimeField
            date={this.props.date}
            timeChangeCallback={this.props.timeChangeCallback}
            mode={this.props.mode}
            darkMode={this.props.darkMode}
            twelveHoursClock={this.props.twelveHoursClock}
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
          local={this.props.local}
          descendingYears={this.props.descendingYears}
          years={this.props.years}
          pastSearchFriendly={this.props.pastSearchFriendly}
          smartMode={this.props.smartMode}
          style={this.props.style}
          darkMode={this.props.darkMode}
        />
        <ActiveNotifier
          selectingModeFrom={this.props.selectingModeFrom}
          mode={this.props.mode}
          smartMode={this.props.smartMode}
          style={this.props.style}
          local={this.props.local}
        />
      </div>
    );
  }
}
