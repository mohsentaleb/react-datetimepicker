import React from 'react';
import clsx from 'clsx';
import type { ClassNames, PresetDateRanges } from '../types';

interface Props {
  selectedRange: number;
  rangeSelectedCallback: (index: number, value: keyof PresetDateRanges) => void;
  viewingIndexChangeCallback: (newIndex: number) => void;
  setFocusedCallback: (index: number, focusedInput: boolean) => void;
  index: number;
  viewingIndex: number;
  label: string;
  focused: boolean[];
  classNames?: ClassNames;
}

interface State {
  focused: boolean;
}

export default class RangeButton extends React.Component<Props, State> {
  button: HTMLButtonElement | null = null;

  constructor(props: Props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidUpdate() {
    let isComponentViewing = this.props.index === this.props.viewingIndex;
    let focused = this.props.focused;
    let focusedOnARange = false;
    for (let i = 0; i < focused.length; i++) {
      if (focused[i] === true) {
        focusedOnARange = true;
        break;
      }
    }
    // If the component we are currently on is the selected viewing component
    // and we are focused on it according to our focused matrix.
    // Then add an event listener for this button and set it as focused
    if (isComponentViewing && focusedOnARange) {
      document.addEventListener('keydown', this.keyDown, false);
      this.button?.focus();
    }
  }

  onFocus() {
    this.setState({ focused: true });
    this.props.setFocusedCallback(this.props.index, true);
  }

  onBlur() {
    this.setState({ focused: false });
    this.props.setFocusedCallback(this.props.index, false);
    document.removeEventListener('keydown', this.keyDown, false);
  }

  keyDown(e: KeyboardEvent) {
    let componentFocused = document.activeElement === this.button;
    // Up Key
    if (e.code === 'ArrowUp' && componentFocused) {
      e.preventDefault();
      this.props.viewingIndexChangeCallback(this.props.index - 1);
    }
    // Down Key
    else if (e.code === 'ArrowDown' && componentFocused) {
      e.preventDefault();
      this.props.viewingIndexChangeCallback(this.props.index + 1);
    }
    // Space Bar and Enter
    else if (e.code === 'Space' || e.code === 'Enter') {
      this.props.rangeSelectedCallback(this.props.index, this.props.label);
    }
  }

  render() {
    let tabIndex;
    const isViewingIndex = this.props.viewingIndex === this.props.index;

    const buttonIsSelected =
      this.props.focused[this.props.index] ||
      this.props.index === this.props.selectedRange;

    if (isViewingIndex) {
      tabIndex = 0;
    } else {
      tabIndex = -1;
    }
    return (
      <button
        ref={(button) => {
          this.button = button;
        }}
        type="button"
        id={'rangeButton' + this.props.index}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        tabIndex={tabIndex}
        className={clsx('whitespace-nowrap rounded px-3 py-1 text-sm', {
          'bg-sky-600 text-white hover:bg-sky-600 hover:text-white':
            buttonIsSelected,
          'bg-gray-50 text-sky-600 hover:bg-sky-700 hover:text-white dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white':
            !buttonIsSelected,
          [this.props.classNames?.rangeButtonSelected || '']: buttonIsSelected,
          [this.props.classNames?.rangeButtonDefault || '']: !buttonIsSelected,
        })}
        onMouseDown={() => {
          this.props.rangeSelectedCallback(this.props.index, this.props.label);
          this.onFocus();
        }}
      >
        {this.props.label}
      </button>
    );
  }
}
