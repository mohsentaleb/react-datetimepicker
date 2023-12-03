import React, { KeyboardEvent, KeyboardEventHandler, MouseEvent } from 'react';
import clsx from 'clsx';

import type { Moment } from 'moment-timezone';
import { Locale } from '../types';

interface Props {
  local: Locale;
  maxDate?: Moment;
  applyCallback: () => void;
  changeVisibleState: () => void;
  autoApply?: boolean;
  standalone?: boolean;
}

interface State {
  hoverColourApply: string;
  hoverColourCancel: string;
  applyFocus: boolean;
  cancelFocus: boolean;
}

export default class ApplyCancelButtons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hoverColourApply: '#5cb85c',
      hoverColourCancel: '#fff',
      applyFocus: false,
      cancelFocus: false,
    };
  }

  cancelPressed = () => {
    this.props.changeVisibleState();
  };

  applyPressed = () => {
    this.props.applyCallback();
  };

  isSpaceBarOrEnterPressed(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      return true;
    }
    return false;
  }

  applyOnKeyPress = (e: KeyboardEvent) => {
    if (this.isSpaceBarOrEnterPressed(e)) {
      this.props.applyCallback();
    }
  };

  cancelOnKeyPress = (e: KeyboardEvent) => {
    if (this.isSpaceBarOrEnterPressed(e)) {
      this.props.changeVisibleState();
    }
  };

  renderButton(
    className: string,
    onClick: (e: MouseEvent) => void,
    onKeyDown: KeyboardEventHandler<HTMLButtonElement>,
    text: string
  ) {
    return (
      <button
        className={className}
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {text}
      </button>
    );
  }

  getMaxDateBox() {
    if (this.props.maxDate) {
      let label = this.props.local?.maxDate || 'Max Date';
      return (
        <div className="maxDateLabel p-2 text-xs">
          {label}: {this.props.maxDate.format(this.props.local.format)}
        </div>
      );
    }
  }

  renderButtons() {
    let applyButton;
    let closeButtonText = this.props.local?.close || 'Close';

    if (!this.props.autoApply) {
      applyButton = this.renderButton(
        'applyButton inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ',
        this.applyPressed,
        this.applyOnKeyPress,
        this.props.local?.apply || 'Apply'
      );
      closeButtonText = this.props.local?.cancel || 'cancel';
    }

    let closeButton = this.renderButton(
      'cancelButton mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
      this.cancelPressed,
      this.cancelOnKeyPress,
      closeButtonText
    );
    return (
      <>
        {applyButton}
        {!this.props.standalone ? closeButton : null}
      </>
    );
  }

  render() {
    let maxDateBox = this.getMaxDateBox();
    let buttons = this.renderButtons();

    return (
      <div
        id="buttonContainer"
        className={clsx('buttonContainer', {
          'float-right': this.props.standalone,
          'bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:items-center sm:px-6':
            !this.props.standalone,
        })}
      >
        {buttons}
        {maxDateBox}
      </div>
    );
  }
}
