import React from 'react';
import '../style/DateTimeRange.css';
import PropTypes from 'prop-types';
import RangeButton from './RangeButton';
class Ranges extends React.Component {
  constructor(props) {
    super(props);

    let focused = [];
    let ranges = Object.keys(this.props.ranges).map(
      (key) => this.props.ranges[key]
    );
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

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.selectedRange !== prevProps.selectedRange) {
        this.setState({
          viewingIndex: this.props.selectedRange,
        });
      }
    }
  }

  viewingIndexChangeCallback(newIndex) {
    // Allow a new item selected to be made
    let length = this.state.focused.length;
    if (newIndex >= 0 && newIndex < length) {
      this.setState({
        viewingIndex: newIndex,
      });
    }
  }

  setFocusedCallback(index, focusedInput) {
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
      <div className="flex flex-col gap-2">
        {Object.keys(this.props.ranges).map((range, i) => (
          <RangeButton
            key={i}
            index={i}
            label={range}
            value={this.props.ranges[range]}
            selectedRange={this.props.selectedRange}
            rangeSelectedCallback={this.props.rangeSelectedCallback}
            viewingIndex={this.state.viewingIndex}
            viewingIndexChangeCallback={this.viewingIndexChangeCallback}
            focused={this.state.focused}
            setFocusedCallback={this.setFocusedCallback}
            style={this.props.style}
          />
        ))}
      </div>
    );
  }
}

Ranges.propTypes = {
  ranges: PropTypes.object.isRequired,
  screenWidthToTheRight: PropTypes.number.isRequired,
  selectedRange: PropTypes.number.isRequired,
  rangeSelectedCallback: PropTypes.func.isRequired,
  style: PropTypes.object,
  noMobileMode: PropTypes.bool,
  forceMobileMode: PropTypes.bool,
};
export default Ranges;
