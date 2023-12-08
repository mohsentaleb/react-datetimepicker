import React from 'react';
import moment from 'moment';
import { isInbetweenDates } from '../utils/TimeFunctionUtils';
import { pastMaxDate } from '../utils/DateSelectedUtils';

import type { Moment } from 'moment';
import { ClassNames, Mode } from '../types';
import clsx from 'clsx';

const normalCellClasses =
  'text-black cursor-pointer dark:text-white caret-transparent';
const hoverCellClasses =
  'text-black bg-sky-100 cursor-pointer dark:bg-slate-400 caret-transparent';
const hoverCellClassesNonBetween = clsx(hoverCellClasses, 'rounded-md');
const greyCellClasses =
  'rounded-md text-gray-200 cursor-pointer opacity-30 caret-transparent';
const invalidClasses = 'text-gray-300 cursor-not-allowed dark:text-slate-500';
const startCellClasses =
  'rounded-l-md text-white bg-sky-500 cursor-pointer caret-transparent';
const endCellClasses =
  'rounded-r-md text-white bg-sky-500 cursor-pointer caret-transparent';
const inBetweenClasses =
  'text-black bg-sky-50 cursor-pointer dark:bg-slate-500 dark:text-white';

interface Props {
  id: number;
  cellDay: Moment;
  date: Moment;
  otherDate: Moment;
  maxDate?: Moment;
  dateSelectedNoTimeCallback: (cellDate: Moment, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Moment, newDate: Moment) => boolean;
  focusOnCallback: (date: Moment | boolean) => void;
  focusDate: boolean | Moment;
  month: number;
  cellFocusedCallback: (date: Moment) => void;
  mode: Mode;
  smartMode?: boolean;
  row?: number;
  classNames?: ClassNames;
}

interface State {
  focus: boolean;
  className: string;
}

export default class Cell extends React.Component<Props, State> {
  cell: HTMLDivElement | null = null;
  constructor(props: Props) {
    super(props);
    this.state = { focus: false, className: '' };
  }

  componentDidUpdate(oldProps: Props) {
    let isDifferentMomentObject =
      !oldProps.date.isSame(this.props.date) ||
      !oldProps.otherDate?.isSame(this.props.otherDate);
    let isDifferentTime =
      this.props.date.format('DD-MM-YYYY HH:mm') !==
        oldProps.date.format('DD-MM-YYYY HH:mm') ||
      this.props.otherDate?.format('DD-MM-YYYY HH:mm') !==
        oldProps.otherDate?.format('DD-MM-YYYY HH:mm');

    if (isDifferentMomentObject || isDifferentTime) {
      this.styleCellNonMouseEnter();
    }

    isDifferentMomentObject = !oldProps.cellDay.isSame(this.props.cellDay);
    isDifferentTime =
      this.props.cellDay.format('DD-MM-YYYY HH:mm') !==
      oldProps.cellDay.format('DD-MM-YYYY HH:mm');

    if (isDifferentMomentObject || isDifferentTime) {
      this.styleCellNonMouseEnter();
    }

    // If a Cell is Selected
    // If the focusDate is this cell
    // and its not a gray cell
    // Then Focus on this cell
    let cellFocused = false;
    let focusDateIsCellDate =
      typeof this.props.focusDate === 'object' &&
      this.props.focusDate.isSame(this.props.cellDay, 'day');
    let activeElement = document.activeElement?.id;
    if (activeElement && activeElement.indexOf('_cell_') !== -1) {
      cellFocused = true;
    }
    if (
      cellFocused &&
      focusDateIsCellDate &&
      !this.isCellMonthSameAsPropMonth(this.props.cellDay)
    ) {
      this.cell?.focus();
      this.props.focusOnCallback(false);
    }
  }

  pastMaxDatePropsChecker(isCellDateProp: boolean, days: number) {
    if (isCellDateProp) {
      if (
        pastMaxDate(
          moment(this.props.date).add(days, 'days'),
          this.props.maxDate,
          true
        )
      ) {
        return true;
      }
    } else {
      if (
        pastMaxDate(
          moment(this.props.otherDate).add(days, 'days'),
          this.props.maxDate,
          true
        )
      ) {
        return true;
      }
    }
    return false;
  }

  keyDown = (e: KeyboardEvent) => {
    let componentFocused = document.activeElement === this.cell;

    if (
      componentFocused &&
      ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)
    ) {
      e.preventDefault();
      let newDate = moment(this.props.cellDay);
      // Check to see if this cell is the date prop
      let isCellDateProp = this.props.cellDay.isSame(this.props.date, 'day');
      if (e.key === 'ArrowUp') {
        // Up Key
        newDate.subtract(7, 'days');
      } else if (e.key === 'ArrowDown') {
        // Down Key
        if (this.pastMaxDatePropsChecker(isCellDateProp, 7)) {
          return;
        }
        newDate.add(7, 'days');
      } else if (e.key === 'ArrowLeft') {
        // Left Key
        newDate.subtract(1, 'days');
      } else if (e.key === 'ArrowRight') {
        // Right Key
        if (this.pastMaxDatePropsChecker(isCellDateProp, 1)) {
          return;
        }
        newDate.add(1, 'days');
      }
      let isSuccessfulCallback = this.props.keyboardCellCallback(
        this.props.cellDay,
        newDate
      );
      if (isSuccessfulCallback) {
        this.props.focusOnCallback(newDate);
      }
    }
  };

  onClick = () => {
    if (pastMaxDate(this.props.cellDay, this.props.maxDate, false)) {
      return;
    }
    this.props.dateSelectedNoTimeCallback(this.props.cellDay, this.props.mode);
  };

  mouseEnter = () => {
    // If Past Max Date Style Cell Out of Use
    if (this.checkAndSetMaxDateStyle(this.props.cellDay)) {
      return;
    }
    // If smart mode disabled check cell dates to ensure not past end in start mode and not before start in end mode
    if (
      !this.props.smartMode &&
      this.nonSmartModePastStartAndEndChecks(this.props.cellDay)
    ) {
      return;
    }

    // Hover Style Cell, Different if inbetween start and end date
    let isDateStart = this.props.date.isSameOrBefore(
      this.props.otherDate,
      'second'
    );
    if (
      isInbetweenDates(
        isDateStart,
        this.props.cellDay,
        this.props.date,
        this.props.otherDate
      )
    ) {
      this.setState({
        className: clsx(
          hoverCellClasses,
          this.props.classNames?.normalCellHover
        ),
      });
    } else {
      this.setState({
        className: clsx(
          hoverCellClassesNonBetween,
          this.props.classNames?.normalCellHover
        ),
      });
    }
  };

  mouseLeave = () => {
    this.styleCellNonMouseEnter();
  };

  onFocus = () => {
    this.props.cellFocusedCallback(this.props.cellDay);
    this.setState({ focus: true });
  };

  onBlur = () => {
    this.setState({ focus: false });
  };

  isCellMonthSameAsPropMonth(cellDay: Moment) {
    let month = this.props.month;
    let cellDayMonth = cellDay.month();
    if (month !== cellDayMonth) {
      return true;
    }
  }

  shouldStyleCellStartEnd(
    cellDay: Moment,
    date: Moment,
    otherDate: Moment,
    startCheck: boolean,
    endCheck: boolean
  ) {
    let isCellDateProp = cellDay.isSame(date, 'day');
    let isCellOtherDateProp = cellDay.isSame(otherDate, 'day');
    let isDateStart = date.isSameOrBefore(otherDate, 'second');
    let isOtherDateStart = otherDate.isSameOrBefore(date, 'second');

    if (startCheck) {
      return (
        (isCellDateProp && isDateStart) ||
        (isCellOtherDateProp && isOtherDateStart)
      );
    } else if (endCheck) {
      return (
        (isCellDateProp && !isDateStart) ||
        (isCellOtherDateProp && !isOtherDateStart)
      );
    }
  }

  checkAndSetMaxDateStyle(cellDate: Moment) {
    // If Past Max Date Style Cell Out of Use
    if (pastMaxDate(cellDate, this.props.maxDate, false)) {
      this.setState({
        className: clsx(invalidClasses, this.props.classNames?.invalidCell),
      });
      return true;
    }
    return false;
  }

  nonSmartModePastStartAndEndChecks(cellDate: Moment) {
    // If in start mode and cellDate past end date style as unavailable. If in end mode and cellDate before start date style as unavailable
    if (this.props.mode === 'start') {
      // We know now the date prop is the start date and the otherDate is the end date in non smart mode
      // If this cell is after end date then invalid cell as this is the start mode
      if (cellDate.isAfter(this.props.otherDate, 'day')) {
        this.setState({
          className: clsx(invalidClasses, this.props.classNames?.invalidCell),
        });
        return true;
      }
    } else if (this.props.mode === 'end') {
      // We know now the date prop is the end date and the otherDate is the start date in non smart mode
      // If this cell is before start date then invalid cell as this is the end mode
      if (cellDate.isBefore(this.props.otherDate, 'day')) {
        this.setState({
          className: clsx(invalidClasses, this.props.classNames?.invalidCell),
        });
        return true;
      }
    }
    return false;
  }

  styleCellNonMouseEnter() {
    let cellDay = this.props.cellDay;
    let date = this.props.date;
    let otherDate = this.props.otherDate;

    // If Past Max Date Style Cell Out of Use
    if (this.checkAndSetMaxDateStyle(cellDay)) {
      return;
    }

    // If smart mode disabled check cell dates to ensure not past end in start mode and not before start in end mode
    if (
      !this.props.smartMode &&
      this.nonSmartModePastStartAndEndChecks(cellDay)
    ) {
      return;
    }

    // Anything cellDay month that is before or after the cell prop month style grey
    if (this.isCellMonthSameAsPropMonth(cellDay)) {
      this.setState({
        className: clsx(greyCellClasses, this.props.classNames?.greyCell),
      });
      return;
    }

    let isDateStart = date.isSameOrBefore(otherDate, 'second');
    let inbetweenDates = isInbetweenDates(
      isDateStart,
      cellDay,
      date,
      otherDate
    );
    let isStart = this.shouldStyleCellStartEnd(
      cellDay,
      date,
      otherDate,
      true,
      false
    );
    let isEnd = this.shouldStyleCellStartEnd(
      cellDay,
      date,
      otherDate,
      false,
      true
    );
    // If start, end or inbetween date then style according to user input or use default
    if (isStart || isEnd || inbetweenDates) {
      let className;
      if (isStart) {
        className = clsx(startCellClasses, this.props.classNames?.startCell);
      } else if (isEnd) {
        className = clsx(endCellClasses, this.props.classNames?.endCell);
      } else {
        className = clsx(
          inBetweenClasses,
          this.props.classNames?.withinRangeCell
        );
      }
      this.setState({ className });
    } else if (inbetweenDates) {
      this.setState({
        className: clsx(
          inBetweenClasses,
          this.props.classNames?.withinRangeCell
        ),
      });
    } else {
      this.setState({
        className: clsx(normalCellClasses, this.props.classNames?.normalCell),
      });
    }
  }

  isStartOrEndDate() {
    let cellDay = this.props.cellDay;
    let date = this.props.date;
    let otherDate = this.props.otherDate;
    if (
      this.shouldStyleCellStartEnd(cellDay, date, otherDate, true, false) ||
      this.shouldStyleCellStartEnd(cellDay, date, otherDate, false, true)
    ) {
      return true;
    }
    return false;
  }

  render() {
    const dateFormatted = this.props.cellDay.format('D');
    let tabIndex = -1;
    if (
      this.isStartOrEndDate() &&
      !this.isCellMonthSameAsPropMonth(this.props.cellDay)
    ) {
      document.addEventListener('keydown', this.keyDown, false);
      tabIndex = 0;
    } else {
      document.removeEventListener('keydown', this.keyDown, false);
    }
    return (
      <div
        ref={(cell) => {
          this.cell = cell;
        }}
        className={clsx(
          'p-2',
          {
            'ring-2 ring-offset-2 ': this.state.focus,
          },
          this.state.className
        )}
        tabIndex={tabIndex}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onClick={this.onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        id={`row_${this.props.row}_cell_${this.props.id}_${this.props.mode}`}
      >
        {dateFormatted}
      </div>
    );
  }
}
