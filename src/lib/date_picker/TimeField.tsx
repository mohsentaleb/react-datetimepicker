import React from 'react';
import clsx from 'clsx';
import { generateMinutes } from '../utils/TimeFunctionUtils';
import { addFocusStyle, darkTheme, lightTheme } from '../utils/StyleUtils';

import TimeIcon from '../icons/clock.svg?react';

import type { Moment } from 'moment-timezone';
import type { Meridiem, Mode } from '../types';
import type { BaseSyntheticEvent } from 'react';

interface Props {
  timeChangeCallback: (newHour: number, newMinute: number, mode: Mode) => void;
  mode: Mode;
  date: Moment;
  darkMode?: boolean;
  twelveHoursClock?: boolean;
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
            this.props.date.format('a') as Meridiem
          )
        : parseInt(event.target.value),
      this.props.date.minute(),
      this.props.mode
    );
  };

  handleMinuteChange = (event: BaseSyntheticEvent) => {
    this.props.timeChangeCallback(
      this.props.date.hour(),
      parseInt(event.target.value),
      this.props.mode
    );
  };

  handleMeridiemChange = (event: BaseSyntheticEvent) => {
    this.props.timeChangeCallback(
      this.convertHourUsingMeridiem(
        parseInt(this.props.date.format('h')),
        event.target.value
      ),
      this.props.date.minute(),
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
    let theme = this.props.darkMode ? darkTheme : lightTheme;
    return (
      <select
        id={id + '_' + this.props.mode}
        style={theme}
        value={valueInput}
        onChange={onChangeInput}
        className="rounded border border-gray-200 p-1"
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
      ? parseInt(this.props.date.format('h'))
      : this.props.date.hour();
    let minute = this.props.date.minute();
    let meridiem = this.props.date.format('a');

    let hourFocusStyle = {};
    hourFocusStyle = addFocusStyle(this.state.hourFocus, hourFocusStyle);
    let minuteFocusStyle = {};
    minuteFocusStyle = addFocusStyle(this.state.minuteFocus, minuteFocusStyle);

    return (
      <div className="flex items-center justify-center p-2">
        <TimeIcon
          className={clsx('mr-2 h-4 w-4', {
            'text-white': this.props.darkMode,
            'text-gray-500': !this.props.darkMode,
          })}
        />
        <div
          className="inline-block"
          onFocus={this.hourFocus}
          onBlur={this.hourBlur}
          style={hourFocusStyle}
        >
          {this.renderSelectField(hour, this.handleHourChange, hours, 'Hour')}
        </div>
        <div className="mx-2 inline-block">:</div>
        <div
          className="inline-block"
          onFocus={this.minuteFocus}
          onBlur={this.minuteBlur}
          style={minuteFocusStyle}
        >
          {this.renderSelectField(
            minute,
            this.handleMinuteChange,
            minutes,
            'Minutes'
          )}
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
