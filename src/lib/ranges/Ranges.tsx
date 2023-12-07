import React from 'react';
import RangeButton from './RangeButton';

import type { ClassNames, PresetDateRanges } from '../types';
import { clsx } from 'clsx';

interface Props {
  ranges: PresetDateRanges;
  selectedRange: number;
  rangeSelectedCallback: (index: number, value: keyof PresetDateRanges) => void;
  noMobileMode?: boolean;
  forceMobileMode?: boolean;
  classNames?: ClassNames;
}

interface State {
  viewingIndex: number;
  focused: boolean[];
}

export default class Ranges extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let focused = [];
    const ranges = Object.values(this.props.ranges);

    for (let i = 0; i < ranges.length; i++) {
      focused.push(false);
    }

    this.state = {
      viewingIndex: this.props.selectedRange,
      focused: focused,
    };

    this.viewingIndexChangeCallback =
      this.viewingIndexChangeCallback.bind(this);
    this.setFocusedCallback = this.setFocusedCallback.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props !== prevProps) {
      if (this.props.selectedRange !== prevProps.selectedRange) {
        this.setState({
          viewingIndex: this.props.selectedRange,
        });
      }
    }
  }

  viewingIndexChangeCallback(newIndex: number) {
    // Allow a new item selected to be made
    let length = this.state.focused.length;
    if (newIndex >= 0 && newIndex < length) {
      this.setState({
        viewingIndex: newIndex,
      });
    }
  }

  setFocusedCallback(index: number, focusedInput: boolean) {
    // Set the focus value of indexed item, focusedInput is true or false
    let focused = this.state.focused;
    focused[index] = focusedInput;
    this.setState({
      focused: focused,
    });
  }

  render() {
    // Map the range index and object name and value to a range button
    return (
      <div
        className={clsx(
          'flex flex-col gap-2',
          this.props.classNames?.rangesContainer
        )}
      >
        {Object.keys(this.props.ranges).map((range, i) => (
          <RangeButton
            key={i}
            index={i}
            label={range}
            // value={this.props.ranges[range]}
            selectedRange={this.props.selectedRange}
            rangeSelectedCallback={this.props.rangeSelectedCallback}
            viewingIndex={this.state.viewingIndex}
            viewingIndexChangeCallback={this.viewingIndexChangeCallback}
            focused={this.state.focused}
            setFocusedCallback={this.setFocusedCallback}
            classNames={this.props.classNames}
          />
        ))}
      </div>
    );
  }
}
