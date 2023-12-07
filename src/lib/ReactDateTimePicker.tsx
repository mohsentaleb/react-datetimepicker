import React from 'react';
import { DateTimeRangePicker } from './DateTimeRangePicker';
import { propValidation } from './utils/PropValidation';
import clsx from 'clsx';

import type { ReactNode } from 'react';
import type { Moment } from 'moment';
import type { ClassNames, Locale, PresetDateRanges } from './types';

export interface ReactDateTimePickerProps {
  ranges: PresetDateRanges;
  start: Moment;
  end: Moment;
  locale: Locale;
  applyCallback: (start: Moment, end: Moment) => void;
  rangeCallback?: (index: number, value: keyof PresetDateRanges) => void;
  maxDate?: Moment;
  autoApply?: boolean;
  descendingYears?: boolean;
  years?: [number, number];
  smartMode?: boolean;
  pastSearchFriendly?: boolean;
  noMobileMode?: boolean;
  forceMobileMode?: boolean;
  twelveHoursClock?: boolean;
  standalone?: boolean;
  leftMode?: boolean;
  centerMode?: boolean;
  classNames?: ClassNames;
  displayMaxDate?: boolean;
  children: ReactNode;
}

interface State {
  visible: boolean;
}

export default class ReactDateTimePicker extends React.Component<
  ReactDateTimePickerProps,
  State
> {
  container: HTMLDivElement | null = null;

  constructor(props: ReactDateTimePickerProps) {
    super(props);
    this.state = {
      visible: false,
    };
    const propValidationReturn = propValidation(this.props);
    if (!propValidationReturn) {
      alert(propValidationReturn);
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.setState({ visible: false });
      document.removeEventListener('keydown', this.keyDown, false);
    }
  };

  onClickContainerHandler = () => {
    if (!this.state.visible) {
      document.addEventListener('click', this.handleOutsideClick, false);
      document.addEventListener('keydown', this.keyDown, false);
      this.changeVisibleState();
    }
  };

  handleOutsideClick = (e: MouseEvent) => {
    // ignore clicks on the component itself
    if (this.state.visible) {
      if (this.container?.contains(e.target as Node)) {
        return;
      }
      document.removeEventListener('click', this.handleOutsideClick, false);
      this.changeVisibleState();
    }
  };

  changeVisibleState = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  renderPicker() {
    return (
      <DateTimeRangePicker
        ranges={this.props.ranges}
        start={this.props.start}
        end={this.props.end}
        locale={this.props.locale}
        applyCallback={this.props.applyCallback}
        rangeCallback={this.props.rangeCallback}
        autoApply={this.props.autoApply}
        changeVisibleState={this.changeVisibleState}
        maxDate={this.props.maxDate}
        descendingYears={this.props.descendingYears}
        years={this.props.years}
        pastSearchFriendly={this.props.pastSearchFriendly}
        smartMode={this.props.smartMode}
        noMobileMode={this.props.noMobileMode}
        forceMobileMode={this.props.forceMobileMode}
        standalone={this.props.standalone}
        twelveHoursClock={this.props.twelveHoursClock == true}
        classNames={this.props.classNames}
        displayMaxDate={this.props.displayMaxDate}
      />
    );
  }

  render() {
    // Special standalone render
    if (this.props.standalone) {
      return (
        <div
          id="datepicker-container-standalone"
          className={clsx(
            'flex max-w-2xl flex-col rounded border border-gray-100 bg-white shadow-lg dark:border-none dark:bg-slate-700 dark:text-white',
            {
              '!flex-col': this.props.forceMobileMode,
              '!flex-row': this.props.noMobileMode,
            },
            this.props.classNames?.rootContainer
          )}
        >
          {this.renderPicker()}
        </div>
      );
    }

    return (
      <div
        id="datepicker-container"
        className="relative"
        onClick={this.onClickContainerHandler}
        ref={(container) => {
          this.container = container;
        }}
      >
        {this.props.children && (
          <div id="datepicker-children">{this.props.children}</div>
        )}
        <div
          id="datepicker"
          className={clsx(
            'absolute top-full z-20 mt-[1px] w-full max-w-2xl rounded border border-gray-100 bg-white shadow-lg dark:border-none dark:bg-slate-700 dark:text-white',
            {
              'right-0': this.props.leftMode,
              'left-1/2': this.props.centerMode,
              'flex flex-col': this.state.visible,
              '!flex-col': this.props.forceMobileMode,
              '!flex-row': this.props.noMobileMode, // If no mobile mode prop not set then allow mobile mode
              hidden: !this.state.visible,
            },
            this.props.classNames?.rootContainer
          )}
        >
          {this.renderPicker()}
        </div>
      </div>
    );
  }
}
