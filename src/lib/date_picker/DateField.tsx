/// <reference types="vite-plugin-svgr/client" />
import React, { BaseSyntheticEvent } from 'react';

import CalendarIcon from '../icons/calendar.svg?react';
import { ClassNames, Mode } from '../types';

interface Props {
  changeSelectingModeCallback: (selectingModeFromParam: boolean) => void;
  mode: Mode;
  dateLabel: string;
  dateTextFieldCallback: (mode: Mode) => void;
  onChangeDateTextHandlerCallback: (newValue: string, mode: Mode) => void;
  classNames?: ClassNames;
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
    return (
      <div className="flex items-stretch" onClick={this.onClick}>
        <span className="block border-gray-200 p-2">
          <CalendarIcon className="h-4 w-4 text-white dark:text-slate-500" />
        </span>
        <input
          className="grow rounded border border-gray-200 p-2 dark:border-slate-500 dark:bg-slate-600"
          id={`datepicker-date-${this.props.mode}`}
          type="text"
          value={this.props.dateLabel}
          onChange={this.onChangeDateTextHandler}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}
