import React from 'react';
import { isInbetweenDates } from '../utils/TimeFunctionUtils';
import { beforeMinDate, pastMaxDate } from '../utils/DateSelectedUtils';

import { ClassNames, Mode, Theme } from '../types';
import clsx from 'clsx';
import { addDays, format, getMonth, isAfter, isBefore, isEqual, isSameDay, subDays } from 'date-fns';
import { defaultTheme } from '../ReactDateTimePicker';

const normalCellClasses = 'text-black cursor-pointer dark:text-white caret-transparent';
const greyCellClasses = 'rounded-md text-gray-200 cursor-pointer opacity-30 caret-transparent';
const invalidCellClasses = 'text-gray-300 cursor-not-allowed dark:text-slate-500';

const hoverCellClasses = {
  blue: 'text-black bg-sky-100 cursor-pointer dark:bg-slate-400 caret-transparent',
  orange: 'text-black bg-orange-100 cursor-pointer dark:bg-slate-400 caret-transparent',
  green: 'text-black bg-emerald-100 cursor-pointer dark:bg-slate-400 caret-transparent',
  purple: 'text-black bg-purple-100 cursor-pointer dark:bg-slate-400 caret-transparent',
};
const startCellClasses = {
  blue: 'rounded-l-md text-white bg-sky-500 cursor-pointer caret-transparent',
  orange: 'rounded-l-md text-white bg-orange-500 cursor-pointer caret-transparent',
  green: 'rounded-l-md text-white bg-emerald-500 cursor-pointer caret-transparent',
  purple: 'rounded-l-md text-white bg-purple-500 cursor-pointer caret-transparent',
};
const endCellClasses = {
  blue: 'rounded-r-md text-white bg-sky-500 cursor-pointer caret-transparent',
  orange: 'rounded-r-md text-white bg-orange-500 cursor-pointer caret-transparent',
  green: 'rounded-r-md text-white bg-emerald-500 cursor-pointer caret-transparent',
  purple: 'rounded-r-md text-white bg-purple-500 cursor-pointer caret-transparent',
};
const inBetweenCellClasses: Record<Theme, string> = {
  blue: 'text-sky-800 bg-sky-50 cursor-pointer dark:bg-slate-500 dark:text-white',
  orange: 'text-orange-800 bg-orange-50 cursor-pointer dark:bg-slate-500 dark:text-white',
  green: 'text-emerald-800 bg-emerald-50 cursor-pointer dark:bg-slate-500 dark:text-white',
  purple: 'text-purple-800 bg-purple-50 cursor-pointer dark:bg-slate-500 dark:text-white',
};

interface Props {
  id: number;
  cellDay: Date;
  date: Date;
  otherDate: Date;
  minDate?: Date;
  maxDate?: Date;
  dateSelectedNoTimeCallback: (cellDate: Date, cellMode: Mode) => void;
  keyboardCellCallback: (originalDate: Date, newDate: Date) => boolean;
  focusOnCallback: (date: Date | boolean) => void;
  focusDate: boolean | Date;
  month: number;
  cellFocusedCallback: (date: Date) => void;
  mode: Mode;
  smartMode?: boolean;
  row?: number;
  classNames?: ClassNames;
  theme?: Theme;
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

  componentDidUpdate(previousProps: Props) {
    let isDifferentTheme = previousProps.theme !== this.props.theme
    let isDifferentDateObject =
      !isEqual(previousProps.date, this.props.date) || !isEqual(previousProps.otherDate, this.props.otherDate);
    let isDifferentTime =
      format(this.props.date, 'dd-MM-yyyy HH:mm') !== format(previousProps.date, 'dd-MM-yyyy HH:mm') ||
      format(this.props.otherDate, 'dd-MM-yyyy HH:mm') !== format(previousProps.otherDate, 'dd-MM-yyyy HH:mm');
    if (isDifferentDateObject || isDifferentTime) {
      this.styleCellNonMouseEnter();
    }

    isDifferentDateObject = !isEqual(previousProps.cellDay, this.props.cellDay);
    isDifferentTime =
      format(this.props.cellDay, 'dd-MM-yyyy HH:mm') !== format(previousProps.cellDay, 'dd-MM-yyyy HH:mm');

    if (isDifferentDateObject || isDifferentTime || isDifferentTheme) {
      this.styleCellNonMouseEnter();
    }

    // If a Cell is Selected
    // If the focusDate is this cell
    // and its not a gray cell
    // Then Focus on this cell
    let cellFocused = false;
    let focusDateIsCellDate =
      typeof this.props.focusDate === 'object' && isSameDay(this.props.focusDate, this.props.cellDay);
    let activeElement = document.activeElement?.id;
    if (activeElement && activeElement.indexOf('_cell_') !== -1) {
      cellFocused = true;
    }
    if (cellFocused && focusDateIsCellDate && !this.isCellMonthSameAsPropMonth(this.props.cellDay)) {
      this.cell?.focus();
      this.props.focusOnCallback(false);
    }
  }

  pastMaxDatePropsChecker(isCellDateProp: boolean, days: number) {
    if (isCellDateProp) {
      if (pastMaxDate(addDays(this.props.date, days), this.props.maxDate, true)) {
        return true;
      }
    } else {
      if (pastMaxDate(addDays(this.props.otherDate, days), this.props.maxDate, true)) {
        return true;
      }
    }
    return false;
  }

  pastMinDatePropsChecker(isCellDateProp: boolean, days: number) {
    if (isCellDateProp) {
      if (beforeMinDate(addDays(this.props.date, days), this.props.minDate, true)) {
        return true;
      }
    } else {
      if (beforeMinDate(addDays(this.props.otherDate, days), this.props.minDate, true)) {
        return true;
      }
    }
    return false;
  }

  keyDown = (e: KeyboardEvent) => {
    let componentFocused = document.activeElement === this.cell;

    if (componentFocused && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      let newDate = new Date(this.props.cellDay);
      // Check to see if this cell is the date prop
      let isCellDateProp = isSameDay(this.props.cellDay, this.props.date);
      if (e.key === 'ArrowUp') {
        // Up Key
        newDate = subDays(newDate, 7);
      } else if (e.key === 'ArrowDown') {
        // Down Key
        if (this.pastMaxDatePropsChecker(isCellDateProp, 7)) {
          return;
        }
        if (this.pastMinDatePropsChecker(isCellDateProp, 7)) {
          return;
        }
        newDate = addDays(newDate, 7);
      } else if (e.key === 'ArrowLeft') {
        // Left Key
        newDate = subDays(newDate, 1);
      } else if (e.key === 'ArrowRight') {
        // Right Key
        if (this.pastMaxDatePropsChecker(isCellDateProp, 1)) {
          return;
        }
        if (this.pastMinDatePropsChecker(isCellDateProp, 7)) {
          return;
        }
        newDate = addDays(newDate, 1);
      }
      let isSuccessfulCallback = this.props.keyboardCellCallback(this.props.cellDay, newDate);
      if (isSuccessfulCallback) {
        this.props.focusOnCallback(newDate);
      }
    }
  };

  onClick = () => {
    if (pastMaxDate(this.props.cellDay, this.props.maxDate, false)) {
      return;
    }
    if (beforeMinDate(this.props.cellDay, this.props.minDate, false)) {
      return;
    }
    this.props.dateSelectedNoTimeCallback(this.props.cellDay, this.props.mode);
  };

  mouseEnter = () => {
    const theme = this.props.theme || defaultTheme;
    // If Past Max Date Style Cell Out of Use
    if (this.checkAndSetMaxDateStyle(this.props.cellDay)) {
      return;
    }
    // If Before Min Date Style Cell Out of Use
    if (this.checkAndSetMinDateStyle(this.props.cellDay)) {
      return;
    }
    // If smart mode disabled check cell dates to ensure not past end in start mode and not before start in end mode
    if (!this.props.smartMode && this.nonSmartModePastStartAndEndChecks(this.props.cellDay)) {
      return;
    }

    // Hover Style Cell, Different if inbetween start and end date
    const isDateStart =
      isBefore(this.props.date, this.props.otherDate) || isEqual(this.props.date, this.props.otherDate);
    if (isInbetweenDates(isDateStart, this.props.cellDay, this.props.date, this.props.otherDate)) {
      this.setState({
        className: clsx(hoverCellClasses[theme], this.props.classNames?.normalCellHover),
      });
    } else {
      // hoverCellClassesNonBetween
      this.setState({
        className: clsx(hoverCellClasses[theme], 'rounded-md', this.props.classNames?.normalCellHover),
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

  isCellMonthSameAsPropMonth(cellDay: Date) {
    let month = this.props.month;
    let cellDayMonth = getMonth(cellDay);
    if (month !== cellDayMonth) {
      return true;
    }
  }

  shouldStyleCellStartEnd(cellDay: Date, date: Date, otherDate: Date, startCheck: boolean, endCheck: boolean) {
    const isCellDateProp = isSameDay(cellDay, date);
    const isCellOtherDateProp = isSameDay(cellDay, otherDate);
    const isDateStart = isBefore(date, otherDate) || isEqual(date, otherDate);
    const isOtherDateStart = isBefore(otherDate, date) || isEqual(otherDate, date);

    if (startCheck) {
      return (isCellDateProp && isDateStart) || (isCellOtherDateProp && isOtherDateStart);
    } else if (endCheck) {
      return (isCellDateProp && !isDateStart) || (isCellOtherDateProp && !isOtherDateStart);
    }
  }

  checkAndSetMaxDateStyle(cellDate: Date) {
    // If Past Max Date Style Cell Out of Use
    if (pastMaxDate(cellDate, this.props.maxDate, false)) {
      this.setState({
        className: clsx(invalidCellClasses, this.props.classNames?.invalidCell),
      });
      return true;
    }
    return false;
  }

  checkAndSetMinDateStyle(cellDate: Date) {
    // If Before Min Date Style Cell Out of Use
    if (beforeMinDate(cellDate, this.props.minDate, false)) {
      this.setState({
        className: clsx(invalidCellClasses, this.props.classNames?.invalidCell),
      });
      return true;
    }
    return false;
  }

  nonSmartModePastStartAndEndChecks(cellDate: Date) {
    // If in start mode and cellDate past end date style as unavailable. If in end mode and cellDate before start date style as unavailable
    if (this.props.mode === 'start') {
      // We know now the date prop is the start date and the otherDate is the end date in non smart mode
      // If this cell is after end date then invalid cell as this is the start mode
      if (!isSameDay(cellDate, this.props.otherDate) && isAfter(cellDate, this.props.otherDate)) {
        this.setState({
          className: clsx(invalidCellClasses, this.props.classNames?.invalidCell),
        });
        return true;
      }
    } else if (this.props.mode === 'end') {
      // We know now the date prop is the end date and the otherDate is the start date in non smart mode
      // If this cell is before start date then invalid cell as this is the end mode
      if (!isSameDay(cellDate, this.props.otherDate) && isBefore(cellDate, this.props.otherDate)) {
        this.setState({
          className: clsx(invalidCellClasses, this.props.classNames?.invalidCell),
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
    const theme = this.props.theme || defaultTheme;

    // If Past Max Date Style Cell Out of Use
    if (this.checkAndSetMaxDateStyle(cellDay)) {
      return;
    }

    // If Before Min Date Style Cell Out of Use
    if (this.checkAndSetMinDateStyle(this.props.cellDay)) {
      return;
    }

    // If smart mode disabled check cell dates to ensure not past end in start mode and not before start in end mode
    if (!this.props.smartMode && this.nonSmartModePastStartAndEndChecks(cellDay)) {
      return;
    }

    // Anything cellDay month that is before or after the cell prop month style grey
    if (this.isCellMonthSameAsPropMonth(cellDay)) {
      this.setState({
        className: clsx(greyCellClasses, this.props.classNames?.greyCell),
      });
      return;
    }

    const isDateStart = isBefore(date, otherDate) || isEqual(date, otherDate);
    let inbetweenDates = isInbetweenDates(isDateStart, cellDay, date, otherDate);
    let isStart = this.shouldStyleCellStartEnd(cellDay, date, otherDate, true, false);
    let isEnd = this.shouldStyleCellStartEnd(cellDay, date, otherDate, false, true);
    // If start, end or inbetween date then style according to user input or use default
    if (isStart || isEnd || inbetweenDates) {
      let className;
      if (isStart) {
        className = clsx(startCellClasses[theme], this.props.classNames?.startCell);
      } else if (isEnd) {
        className = clsx(endCellClasses[theme], this.props.classNames?.endCell);
      } else {
        className = clsx(inBetweenCellClasses[theme], this.props.classNames?.withinRangeCell);
      }
      this.setState({ className });
    } else if (inbetweenDates) {
      this.setState({
        className: clsx(inBetweenCellClasses[theme], this.props.classNames?.withinRangeCell),
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
    const dateFormatted = format(this.props.cellDay, 'd');
    let tabIndex = -1;
    if (this.isStartOrEndDate() && !this.isCellMonthSameAsPropMonth(this.props.cellDay)) {
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
