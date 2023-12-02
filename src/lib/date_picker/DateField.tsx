/// <reference types="vite-plugin-svgr/client" />
import React, { BaseSyntheticEvent } from 'react';
import { darkTheme, lightTheme } from '../utils/StyleUtils';

import CalendarIcon from '../icons/calendar.svg?react';
import clsx from 'clsx';
import { Mode } from '../types';

interface Props {
  changeSelectingModeCallback: (selectingModeFromParam: boolean) => void;
  mode: Mode;
  dateLabel: string;
  dateTextFieldCallback: (mode: Mode) => void;
  onChangeDateTextHandlerCallback: (newValue: string, mode: Mode) => void;
  darkMode?: boolean;
}

export default class DateField extends React.Component<Props> {
  onChangeDateTextHandler = (event: BaseSyntheticEvent) => {
    this.props.onChangeDateTextHandlerCallback(
      event.target.value,
      this.props.mode
    );
  };

  onBlur = () => {
    this.props.dateTextFieldCallback(this.props.mode);
  };

  onClick = () => {
    if (this.props.mode === 'start') {
      this.props.changeSelectingModeCallback(true);
    } else {
      this.props.changeSelectingModeCallback(false);
    }
  };

  render() {
    let theme = this.props.darkMode ? darkTheme : lightTheme;
    return (
      <div className="flex items-stretch" onClick={this.onClick}>
        <span className="block rounded rounded-l-none border-gray-200 p-2">
          <CalendarIcon
            className={clsx('h-4 w-4', {
              'text-white': this.props.darkMode,
              'text-gray-500': !this.props.darkMode,
            })}
          />
        </span>
        <input
          className="grow rounded rounded-l-none border border-gray-200 p-2"
          id={'DateTimeInput_' + this.props.mode}
          style={theme}
          type="text"
          value={this.props.dateLabel}
          onChange={this.onChangeDateTextHandler}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}
