import React from 'react';
import { generateMinutes } from '../utils/TimeFunctionUtils';

import TimeIcon from '../icons/clock.svg?react';

import type { ClassNames, Meridiem, Mode } from '../types';
import type { BaseSyntheticEvent } from 'react';
import clsx from 'clsx';
import { format, getHours, getMinutes } from 'date-fns';

interface Props {
  timeChangeCallback: (newHour: number, newMinute: number, mode: Mode) => void;
  mode: Mode;
  date: Date;
  twelveHoursClock?: boolean;
  classNames?: ClassNames;
}

interface State {
  hourFocus: boolean;
  minuteFocus: boolean;
}
export default class TimeField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hourFocus: false,
      minuteFocus: false,
    };
  }

  generateHourSelectValues() {
    let selectValues = [];
    for (
      let i = this.props.twelveHoursClock ? 1 : 0;
      i <= (this.props.twelveHoursClock ? 12 : 23);
      i++
    ) {
      selectValues.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return selectValues;
  }

  generateMinuteSelectValues() {
    let minutes = generateMinutes();
    let selectValues = [];
    for (let i = 0; i < minutes.length; i++) {
      selectValues.push(
        <option key={i} value={i}>
          {minutes[i]}
        </option>
      );
    }
    return selectValues;
  }

  generateMeridiemSelectValues() {
    let selectValues = [
      <option key={'am'} value={'am'}>
        AM
      </option>,
      <option key={'pm'} value={'pm'}>
        PM
      </option>,
    ];

    return selectValues;
  }

  convertHourUsingMeridiem(hour: number, meridiem: Meridiem) {
    if (meridiem === 'pm' && hour !== 12) {
      return hour + 12;
    } else if (meridiem === 'am' && hour === 12) return 0;
    else return hour;
  }

  handleHourChange = (event: BaseSyntheticEvent) => {
    this.props.timeChangeCallback(
      this.props.twelveHoursClock
        ? this.convertHourUsingMeridiem(
            parseInt(event.target.value),
            format(this.props.date, 'aaa') as Meridiem
          )
        : parseInt(event.target.value),
      getMinutes(this.props.date),
      this.props.mode
    );
  };

  handleMinuteChange = (event: BaseSyntheticEvent) => {
    this.props.timeChangeCallback(
      getHours(this.props.date),
      parseInt(event.target.value),
      this.props.mode
    );
  };

  handleMeridiemChange = (event: BaseSyntheticEvent) => {
    this.props.timeChangeCallback(
      this.convertHourUsingMeridiem(
        parseInt(format(this.props.date, 'h')),
        event.target.value
      ),
      getMinutes(this.props.date),
      this.props.mode
    );
  };

  hourFocus = () => {
    this.setState({ hourFocus: true });
  };

  hourBlur = () => {
    this.setState({ hourFocus: false });
  };

  minuteFocus = () => {
    this.setState({ minuteFocus: true });
  };

  minuteBlur = () => {
    this.setState({ minuteFocus: false });
  };

  renderSelectField(
    valueInput: number | string,
    onChangeInput: (event: BaseSyntheticEvent) => void,
    optionsInput: JSX.Element[],
    id: string
  ) {
    return (
      <select
        id={id + '_' + this.props.mode}
        value={valueInput}
        onChange={onChangeInput}
        className="rounded border border-gray-200 p-1 dark:border-slate-500 dark:bg-slate-600"
      >
        {optionsInput}
      </select>
    );
  }

  render() {
    let hours = this.generateHourSelectValues();
    let minutes = this.generateMinuteSelectValues();
    let meridiems = this.generateMeridiemSelectValues();
    let hour = this.props.twelveHoursClock
      ? parseInt(format(this.props.date, 'h'))
      : getHours(this.props.date);
    let minute = getMinutes(this.props.date);
    let meridiem = format(this.props.date, 'aaa');

    return (
      <div className="flex items-center justify-center gap-2 p-2">
        <TimeIcon className="mr-2 h-4 w-4 text-white dark:text-slate-500" />
        <div className="flex items-center">
          <div
            className={clsx('grow', {
              'ring-2 ring-offset-2': this.state.hourFocus,
            })}
            onFocus={this.hourFocus}
            onBlur={this.hourBlur}
          >
            {this.renderSelectField(hour, this.handleHourChange, hours, 'Hour')}
          </div>
          <div className="mx-1">:</div>
          <div
            className={clsx('grow', {
              'ring-2 ring-offset-2': this.state.minuteFocus,
            })}
            onFocus={this.minuteFocus}
            onBlur={this.minuteBlur}
          >
            {this.renderSelectField(
              minute,
              this.handleMinuteChange,
              minutes,
              'Minutes'
            )}
          </div>
        </div>
        {this.props.twelveHoursClock && (
          <div className="inline-block">
            {this.renderSelectField(
              meridiem,
              this.handleMeridiemChange,
              meridiems,
              'Meridiem'
            )}
          </div>
        )}
      </div>
    );
  }
}
