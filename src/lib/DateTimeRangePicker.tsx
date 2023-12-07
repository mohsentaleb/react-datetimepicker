import React from 'react';
import moment from 'moment';
import Ranges from './ranges/Ranges';
import DatePicker from './date_picker/DatePicker';
import { isValidTimeChange } from './utils/TimeFunctionUtils';
import { datePicked, pastMaxDate } from './utils/DateSelectedUtils';
import ApplyCancelButtons from './date_picker/ApplyCancelButtons';

import type { Moment } from 'moment';
import type {
  Locale,
  Mode,
  PresetDateRanges,
  ClassNames,
} from './types';

export const ModeEnum = Object.freeze({ start: 'start', end: 'end' });
export let momentFormat = 'DD-MM-YYYY HH:mm';

interface Props {
  ranges: PresetDateRanges;
  start: Moment;
  end: Moment;
  locale: Locale;
  applyCallback: (start: Moment, end: Moment) => void;
  rangeCallback?: (index: number, value: keyof PresetDateRanges) => void;
  autoApply?: boolean;
  maxDate?: Moment;
  descendingYears?: boolean;
  years?: [number, number];
  pastSearchFriendly?: boolean;
  smartMode?: boolean;
  changeVisibleState: () => void;
  noMobileMode?: boolean;
  forceMobileMode?: boolean;
  standalone?: boolean;
  twelveHoursClock?: boolean;
  selectedRange?: number;
  classNames?: ClassNames;
  displayMaxDate?: boolean;
}

interface State {
  selectedRange: number;
  selectingModeFrom: boolean;
  ranges: PresetDateRanges;
  start: Moment;
  startLabel: string;
  end: Moment;
  endLabel: string;
  focusDate: boolean | Moment;
  momentFormat: string;
}

class DateTimeRangePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let ranges = {} as PresetDateRanges;
    let customRange = { 'Custom Range': 'Custom Range' };
    Object.assign(ranges, this.props.ranges, customRange);
    let localeMomentFormat = `DD-MM-YYYY ${
      this.props.twelveHoursClock ? 'h:mm A' : 'HH:mm'
    }`;

    if (this.props.locale && this.props.locale.format) {
      momentFormat = this.props.locale.format;
      localeMomentFormat = this.props.locale.format;
    }

    this.state = {
      selectedRange: this.props.selectedRange || 0,
      selectingModeFrom: true,
      ranges: ranges,
      start: this.props.start,
      startLabel: this.props.start?.format(localeMomentFormat),
      end: this.props.end,
      endLabel: this.props.end?.format(localeMomentFormat),
      focusDate: false,
      momentFormat: localeMomentFormat,
    };
  }

  componentDidMount() {
    this.setToRangeValue(this.state.start, this.state.end);
  }

  componentDidUpdate(prevProps: Props) {
    let isDifferentMomentObject =
      !this.props.start?.isSame(prevProps.start) ||
      !this.props.end?.isSame(prevProps.end);
    let isDifferentTime =
      this.props.start?.format('DD-MM-YYYY HH:mm') !==
        prevProps.start?.format('DD-MM-YYYY HH:mm') ||
      this.props.end?.format('DD-MM-YYYY HH:mm') !==
        prevProps.end?.format('DD-MM-YYYY HH:mm');
    if (isDifferentMomentObject || isDifferentTime) {
      this.setState(
        {
          start: this.props.start,
          end: this.props.end,
        },
        () =>
          this.updateStartEndAndLabels(this.props.start, this.props.end, true)
      );
    }
  }

  applyCallback = () => {
    this.props.applyCallback(this.state.start, this.state.end);
    this.props.changeVisibleState();
  };

  checkAutoApplyActiveApplyIfActive(startDate: Moment, endDate: Moment) {
    if (this.props.autoApply) {
      this.props.applyCallback(startDate, endDate);
    }
  }

  rangeSelectedCallback = (index: number, value: keyof PresetDateRanges) => {
    // If Past Max Date Dont allow update
    let start = this.state.start;
    let end = this.state.end;

    if (value !== 'Custom Range') {
      start = this.state.ranges[value][0];
      end = this.state.ranges[value][1];
      if (
        pastMaxDate(start, this.props.maxDate, true) ||
        pastMaxDate(end, this.props.maxDate, true)
      ) {
        return false;
      }
    }
    // Else update state to new selected index and update start and end time
    this.setState({ selectedRange: index });
    if (value !== 'Custom Range') {
      this.updateStartEndAndLabels(start, end);
    }
    if (this.props.rangeCallback) {
      this.props.rangeCallback(index, value);
    }

    if (value !== 'Custom Range') {
      this.checkAutoApplyActiveApplyIfActive(start, end);
    }
  };

  setToRangeValue(startDate: Moment, endDate: Moment) {
    const rangesArray = Object.values(this.state.ranges);

    for (let i = 0; i < rangesArray.length; i++) {
      const currentRange = rangesArray[i];

      if (currentRange === 'Custom Range') {
        continue;
      } else if (Array.isArray(currentRange)) {
        if (
          currentRange[0]?.isSame(startDate, 'minutes') &&
          currentRange[1]?.isSame(endDate, 'minutes')
        ) {
          this.setState({ selectedRange: i });
          return;
        }
      }
    }
    this.setToCustomRange();
  }

  setToCustomRange() {
    const rangesArray = Object.values(this.state.ranges);

    for (let i = 0; i < rangesArray.length; i++) {
      if (rangesArray[i] === 'Custom Range') {
        this.setState({ selectedRange: i });
      }
    }
  }

  updateStartEndAndLabels(
    newStart: Moment,
    newEnd: Moment,
    updateCalendar?: boolean
  ) {
    this.setState(
      {
        start: newStart,
        startLabel: newStart.format(this.state.momentFormat),
        end: newEnd,
        endLabel: newEnd.format(this.state.momentFormat),
      },
      () => {
        if (updateCalendar) {
          this.updateCalendarRender();
        }
      }
    );
  }

  updateCalendarRender() {
    this.dateTextFieldCallback('start');
    this.dateTextFieldCallback('end');
  }

  // Currently called from Cell selection
  dateSelectedNoTimeCallback = (cellDate: Moment, cellMode: Mode) => {
    // If in smart mode get the new date selecting mode from the selectingMode (Changes between too and from)
    // If in non smart mode take the new date selecting mode from the callback mode param
    let isSelectingModeFrom;
    if (this.props.smartMode) {
      isSelectingModeFrom = this.state.selectingModeFrom;
    } else if (cellMode === 'start') {
      isSelectingModeFrom = true;
    } else {
      isSelectingModeFrom = false;
    }

    // Get the new dates from the dates selected by the user
    let newDates = datePicked(
      this.state.start,
      this.state.end,
      cellDate,
      isSelectingModeFrom,
      this.props.smartMode
    );
    // unpack the new dates and set them
    let startDate = newDates.startDate;
    let endDate = newDates.endDate;
    let newStart = this.duplicateMomentTimeFromState(startDate, true);
    let newEnd = this.duplicateMomentTimeFromState(endDate, false);
    this.updateStartEndAndLabels(newStart, newEnd);
    this.setToRangeValue(newStart, newEnd);
    // If Smart Mode is active change the selecting mode to opposite of what was just pressed
    if (this.props.smartMode) {
      this.setState((prevState) => ({
        selectingModeFrom: !prevState.selectingModeFrom,
      }));
    }
    this.checkAutoApplyActiveApplyIfActive(newStart, newEnd);
  };

  changeSelectingModeCallback = (selectingModeFromParam: boolean) => {
    if (this.props.smartMode) {
      this.setState({ selectingModeFrom: selectingModeFromParam });
    }
  };

  duplicateMomentTimeFromState(date: Moment, startDate: boolean) {
    let state;
    if (startDate) {
      state = this.state.start;
    } else {
      state = this.state.end;
    }
    let newDate = [
      date.year(),
      date.month(),
      date.date(),
      state.hours(),
      state.minutes(),
      state.seconds(),
    ];
    return moment(newDate);
  }

  timeChangeCallback = (newHour: number, newMinute: number, mode: Mode) => {
    if (mode === 'start') {
      this.updateStartTime(newHour, newMinute, mode);
    } else if (mode === 'end') {
      this.updateEndTime(newHour, newMinute, mode);
    }
  };

  updateStartTime(newHour: number, newMinute: number, mode: Mode) {
    this.updateTime(this.state.start, newHour, newMinute, mode, 'start');
  }

  updateEndTime(newHour: number, newMinute: number, mode: Mode) {
    this.updateTime(this.state.end, newHour, newMinute, mode, 'end');
  }

  updateTime(
    origDate: Moment,
    newHour: number,
    newMinute: number,
    mode: Mode,
    stateDateToChangeName: Mode
  ) {
    let date = moment(origDate);
    date.hours(newHour);
    date.minutes(newMinute);
    // If Past Max Date Dont allow update
    if (pastMaxDate(date, this.props.maxDate, true)) {
      return false;
    }
    // If Valid Time Change allow the change else if in smart mode
    // set new start and end times to be minute ahead/behind the new date
    // else dont allow the change
    if (isValidTimeChange(mode, date, this.state.start, this.state.end)) {
      if (stateDateToChangeName === 'start') {
        this.setState({
          start: date,
          startLabel: date.format(this.state.momentFormat),
        });
      } else {
        this.setState({
          end: date,
          endLabel: date.format(this.state.momentFormat),
        });
      }

      this.updateTimeCustomRangeUpdator(stateDateToChangeName, date);
      if (stateDateToChangeName === 'end') {
        this.checkAutoApplyActiveApplyIfActive(this.state.start, date);
      } else {
        this.checkAutoApplyActiveApplyIfActive(date, this.state.end);
      }
    } else if (this.props.smartMode) {
      let newDate = moment(date);
      if (mode === 'start') {
        newDate.add(1, 'minute');
        this.updateStartEndAndLabels(date, newDate);
        this.setToRangeValue(date, newDate);
        this.checkAutoApplyActiveApplyIfActive(date, newDate);
      } else {
        newDate.subtract(1, 'minute');
        this.updateStartEndAndLabels(newDate, date);
        this.setToRangeValue(newDate, date);
        this.checkAutoApplyActiveApplyIfActive(newDate, date);
      }
    } else {
      this.updateStartEndAndLabels(this.state.start, this.state.end);
      this.setToRangeValue(this.state.start, this.state.end);
      this.checkAutoApplyActiveApplyIfActive(this.state.start, this.state.end);
    }
  }

  updateTimeCustomRangeUpdator(stateDateToChangeName: Mode, date: Moment) {
    if (stateDateToChangeName === 'start') {
      this.setToRangeValue(date, this.state.end);
    } else {
      this.setToRangeValue(this.state.start, date);
    }
  }

  dateTextFieldCallback = (mode: Mode) => {
    if (mode === 'start') {
      let newDate = moment(this.state.startLabel, this.state.momentFormat);
      let isValidNewDate = newDate.isValid();
      let isSameOrBeforeEnd = newDate.isSameOrBefore(this.state.end, 'second');
      let isAfterEndDate = newDate.isAfter(this.state.end);
      this.updateDate(
        mode,
        newDate,
        isValidNewDate,
        isSameOrBeforeEnd,
        isAfterEndDate,
        'start'
      );
    } else {
      let newDate = moment(this.state.endLabel, this.state.momentFormat);
      let isValidNewDate = newDate.isValid();
      let isBeforeStartDate = newDate.isBefore(this.state.start);
      let isSameOrAfterStartDate = newDate.isSameOrAfter(
        this.state.start,
        'second'
      );
      this.updateDate(
        mode,
        newDate,
        isValidNewDate,
        isSameOrAfterStartDate,
        isBeforeStartDate,
        'end'
      );
    }
  };

  updateDate(
    mode: Mode,
    newDate: Moment,
    isValidNewDate: boolean,
    isValidDateChange: boolean,
    isInvalidDateChange: boolean,
    stateDateToChangeName: Mode
  ) {
    // If new date past max date dont allow change
    if (pastMaxDate(newDate, this.props.maxDate, true)) {
      this.updateStartEndAndLabels(this.state.start, this.state.end);
      return false;
    }
    // Else if date valid and date change valid update the date,
    if (isValidNewDate && isValidDateChange) {
      if (stateDateToChangeName === 'start') {
        this.setState({
          start: newDate,
          startLabel: newDate.format(this.state.momentFormat),
        });
      } else {
        this.setState({
          end: newDate,
          endLabel: newDate.format(this.state.momentFormat),
        });
      }
      this.updateTimeCustomRangeUpdator(stateDateToChangeName, newDate);
      if (stateDateToChangeName === 'end') {
        this.checkAutoApplyActiveApplyIfActive(this.state.start, newDate);
      } else {
        this.checkAutoApplyActiveApplyIfActive(newDate, this.state.end);
      }
    }
    // If new date valid but date change invalid go into update invalid mode,
    // adds/subtract 1 days from start/stop value
    // Only do this if in smart mode though
    else if (isValidNewDate && isInvalidDateChange && this.props.smartMode) {
      this.updateInvalidDate(mode, newDate);
    } else {
      this.updateStartEndAndLabels(this.state.start, this.state.end);
    }
  }

  updateInvalidDate(mode: Mode, newDate: Moment) {
    if (mode === 'start') {
      let newEndDate = moment(newDate).add(1, 'day');
      this.updateLabelsAndRangeValues(newDate, newEndDate);
      this.checkAutoApplyActiveApplyIfActive(newDate, newEndDate);
    } else {
      let newStartDate = moment(newDate).subtract(1, 'day');
      this.updateStartEndAndLabels(newStartDate, newDate);
      this.checkAutoApplyActiveApplyIfActive(newStartDate, newDate);
    }
  }

  updateLabelsAndRangeValues(startDate: Moment, endDate: Moment) {
    this.updateStartEndAndLabels(startDate, endDate);
    this.setToRangeValue(startDate, endDate);
  }

  onChangeDateTextHandlerCallback = (newValue: string, mode: Mode) => {
    if (mode === 'start') {
      this.setState({
        startLabel: newValue,
      });
    } else if (mode === 'end') {
      this.setState({
        endLabel: newValue,
      });
    }
  };

  keyboardCellCallback = (originalDate: Moment, newDate: Moment) => {
    let startDate;
    let endDate;
    // If original date same as start and end date, and not in smart mode
    // Then if cell end called allow new end date. Allow new start if cell start called
    // Done for when the start and end date are the same
    if (
      originalDate.isSame(this.state.start, 'day') &&
      originalDate.isSame(this.state.end, 'day') &&
      !this.props.smartMode
    ) {
      let activeElement = document.activeElement?.id;
      // If Focused Cell is an end cell
      if (
        activeElement &&
        activeElement.includes('_cell_') &&
        activeElement.includes('_end')
      ) {
        // Allow a new end date from the date calledback
        startDate = moment(this.state.start);
        endDate = this.duplicateMomentTimeFromState(newDate, false);
        // EDGE CASE: Due to Cell focusing issues if Start and End date same
        // due to Key press into each other, if you then press left it always
        // calls it from the end cell so allow the end cell to handle this
        // and switch to start when this occurs
        if (!startDate.isSameOrBefore(endDate, 'second')) {
          startDate = this.duplicateMomentTimeFromState(newDate, true);
          endDate = moment(this.state.end);
        }
      } else if (
        activeElement &&
        activeElement.includes('_cell_') &&
        activeElement.includes('_start')
      ) {
        startDate = this.duplicateMomentTimeFromState(newDate, true);
        endDate = moment(this.state.end);
      }
    }

    if (!startDate && !endDate) {
      // If original is the start date only, then set the start date to the new date
      if (originalDate.isSame(this.state.start, 'day')) {
        startDate = this.duplicateMomentTimeFromState(newDate, true);
        endDate = moment(this.state.end);
        //  Not in Smart Mode and Start Date after End Date then invalid change
        if (!this.props.smartMode && startDate.isAfter(endDate, 'second')) {
          return false;
        }
      }
      // End date only, set the end date to the new date
      else {
        startDate = moment(this.state.start);
        endDate = this.duplicateMomentTimeFromState(newDate, false);
        //  Not in Smart Mode and Start Date after End Date then invalid change
        if (!this.props.smartMode && startDate.isAfter(endDate, 'second')) {
          return false;
        }
      }
    }

    if (startDate && endDate) {
      if (startDate?.isSameOrBefore(endDate, 'second')) {
        this.updateStartEndAndLabels(startDate, endDate);
        this.checkAutoApplyActiveApplyIfActive(startDate, endDate);
      } else {
        this.updateStartEndAndLabels(endDate, startDate);
        this.checkAutoApplyActiveApplyIfActive(endDate, startDate);
      }
    }

    return true;
  };

  focusOnCallback = (date: Moment | boolean) => {
    if (date) {
      this.setState({
        focusDate: date,
      });
    } else {
      this.setState({
        focusDate: false,
      });
    }
  };

  cellFocusedCallback = (date: Moment) => {
    if (date.isSame(this.state.start, 'day')) {
      this.changeSelectingModeCallback(true);
    } else if (date.isSame(this.state.end, 'day')) {
      this.changeSelectingModeCallback(false);
    }
  };

  renderStartDate(locale: Locale) {
    let label = locale && locale.fromDate ? locale.fromDate : 'From Date';
    return (
      <DatePicker
        label={label}
        date={this.state.start}
        otherDate={this.state.end}
        mode="start"
        dateSelectedNoTimeCallback={this.dateSelectedNoTimeCallback}
        timeChangeCallback={this.timeChangeCallback}
        dateTextFieldCallback={this.dateTextFieldCallback}
        keyboardCellCallback={this.keyboardCellCallback}
        focusOnCallback={this.focusOnCallback}
        focusDate={this.state.focusDate}
        cellFocusedCallback={this.cellFocusedCallback}
        onChangeDateTextHandlerCallback={this.onChangeDateTextHandlerCallback}
        dateLabel={this.state.startLabel}
        selectingModeFrom={this.state.selectingModeFrom}
        changeSelectingModeCallback={this.changeSelectingModeCallback}
        maxDate={this.props.maxDate}
        locale={this.props.locale}
        descendingYears={this.props.descendingYears}
        years={this.props.years}
        pastSearchFriendly={this.props.pastSearchFriendly}
        smartMode={this.props.smartMode}
        twelveHoursClock={this.props.twelveHoursClock}
        classNames={this.props.classNames}
      />
    );
  }

  renderEndDate(locale: Locale) {
    let label = locale && locale.toDate ? locale.toDate : 'To Date';
    return (
      <DatePicker
        label={label}
        date={this.state.end}
        otherDate={this.state.start}
        mode="end"
        dateSelectedNoTimeCallback={this.dateSelectedNoTimeCallback}
        timeChangeCallback={this.timeChangeCallback}
        dateTextFieldCallback={this.dateTextFieldCallback}
        keyboardCellCallback={this.keyboardCellCallback}
        focusOnCallback={this.focusOnCallback}
        focusDate={this.state.focusDate}
        cellFocusedCallback={this.cellFocusedCallback}
        onChangeDateTextHandlerCallback={this.onChangeDateTextHandlerCallback}
        dateLabel={this.state.endLabel}
        selectingModeFrom={this.state.selectingModeFrom}
        changeSelectingModeCallback={this.changeSelectingModeCallback}
        maxDate={this.props.maxDate}
        locale={this.props.locale}
        descendingYears={this.props.descendingYears}
        years={this.props.years}
        pastSearchFriendly={this.props.pastSearchFriendly}
        smartMode={this.props.smartMode}
        twelveHoursClock={this.props.twelveHoursClock}
        classNames={this.props.classNames}
      />
    );
  }

  render() {
    return (
      <>
        <div className="flex flex-col gap-2 p-2 md:flex-row">
          <Ranges
            ranges={this.state.ranges}
            selectedRange={this.state.selectedRange}
            rangeSelectedCallback={this.rangeSelectedCallback}
            noMobileMode={this.props.noMobileMode}
            forceMobileMode={this.props.forceMobileMode}
            classNames={this.props.classNames}
          />
          {this.renderStartDate(this.props.locale)}
          {this.renderEndDate(this.props.locale)}
        </div>
        <ApplyCancelButtons
          changeVisibleState={this.props.changeVisibleState}
          applyCallback={this.applyCallback}
          locale={this.props.locale}
          maxDate={this.props.maxDate}
          autoApply={this.props.autoApply}
          standalone={this.props.standalone}
          displayMaxDate={this.props.displayMaxDate}
          classNames={this.props.classNames}
        />
      </>
    );
  }
}

export { DateTimeRangePicker };
