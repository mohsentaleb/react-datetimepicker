import React from 'react';
import CalendarRow from './CalendarRow';

import type { Moment } from 'moment';
import { ClassNames, Mode } from '../types';

interface Props {
  date: Moment;
  fourtyTwoDays: Moment[];
  otherDate: Moment;
  maxDate?: Moment;
  dateSelectedNoTimeCallback: (cellDate: Moment, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Moment, newDate: Moment) => boolean;
  focusOnCallback: (date: Moment | boolean) => void;
  focusDate: boolean | Moment;
  cellFocusedCallback: (date: Moment) => void;
  year: number;
  month: number;
  mode: Mode;
  smartMode?: boolean;
  classNames?: ClassNames;
}

export default class CalendarRows extends React.Component<Props> {
  generateDays() {
    let calendarRows = [];
    for (let i = 0; i < 6; i++) {
      let startIndex = i * 7;
      let endIndex = (i + 1) * 7;
      let rowDays = this.props.fourtyTwoDays.slice(startIndex, endIndex);
      calendarRows.push(
        <CalendarRow
          key={i}
          row={i}
          rowDays={rowDays}
          date={this.props.date}
          otherDate={this.props.otherDate}
          maxDate={this.props.maxDate}
          month={this.props.month}
          year={this.props.year}
          dateSelectedNoTimeCallback={this.props.dateSelectedNoTimeCallback}
          keyboardCellCallback={this.props.keyboardCellCallback}
          focusOnCallback={this.props.focusOnCallback}
          focusDate={this.props.focusDate}
          cellFocusedCallback={this.props.cellFocusedCallback}
          mode={this.props.mode}
          smartMode={this.props.smartMode}
          classNames={this.props.classNames}
        />
      );
    }
    return calendarRows;
  }

  render() {
    let calendarRows = this.generateDays();
    return <div>{calendarRows}</div>;
  }
}
