import React from 'react';
import Cell from './Cell';

import type { Moment } from 'moment';
import { ClassNames, Mode } from '../types';

interface Props {
  row: number;
  rowDays: Moment[];
  date: Moment;
  otherDate: Moment;
  maxDate?: Moment;
  dateSelectedNoTimeCallback: (cellDate: Moment, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Moment, newDate: Moment) => boolean;
  focusOnCallback: (date: Moment | boolean) => void;
  focusDate: boolean | Moment;
  year: number;
  month: number;
  cellFocusedCallback: (date: Moment) => void;
  mode: Mode;
  smartMode?: boolean;
  classNames?: ClassNames;
}

export default class CalendarRow extends React.Component<Props> {
  generateCells() {
    let cells = [];
    let daysSize = this.props.rowDays.length;
    for (let i = 0; i < daysSize; i++) {
      cells.push(
        <Cell
          key={i}
          id={i}
          row={this.props.row}
          cellDay={this.props.rowDays[i]}
          date={this.props.date}
          otherDate={this.props.otherDate}
          maxDate={this.props.maxDate}
          month={this.props.month}
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
    return cells;
  }

  render() {
    let cells = this.generateCells();
    return <div className="grid grid-cols-7 text-center">{cells}</div>;
  }
}
