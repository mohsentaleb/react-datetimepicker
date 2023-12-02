import React from 'react';
import type { Locale, Mode, Style } from '../types';

interface Props {
  mode: Mode;
  selectingModeFrom: boolean;
  smartMode?: boolean;
  style?: Style;
  local?: Locale;
}
export default class ActiveNotifier extends React.Component<Props> {
  getDotDiv(text: string, style: React.CSSProperties, id: string) {
    return (
      <div className="activeNotifier flex items-center justify-center" id={id}>
        {text}{' '}
        <span
          className="ml-2 inline-block h-3 w-3 rounded-full bg-green-700"
          style={style}
        />
      </div>
    );
  }

  render() {
    let selectingModeFrom = this.props.selectingModeFrom;
    let mode = this.props.mode;
    let startDotStyle =
      this.props.style && this.props.style.fromDot
        ? this.props.style.fromDot
        : { backgroundColor: '#12bc00' };
    let endDotStyle =
      this.props.style && this.props.style.toDot
        ? this.props.style.toDot
        : { backgroundColor: '#D70022' };
    let startNotifierID = 'startNotifierID';
    let endNotifierID = 'endNotifierID';
    let local = this.props.local;
    if (this.props.smartMode) {
      if (selectingModeFrom && mode === 'start') {
        let label =
          local && local.selectingFrom ? local.selectingFrom : 'Selecting From';
        return this.getDotDiv(`${label} `, startDotStyle, startNotifierID);
      } else if (!selectingModeFrom && mode === 'end') {
        let label =
          local && local.selectingTo ? local.selectingTo : 'Selecting To';
        return this.getDotDiv(`${label} `, endDotStyle, endNotifierID);
      }
    } else {
      if (mode === 'start') {
        let label = local && local.fromDate ? local.fromDate : 'From Date';
        return this.getDotDiv(`${label} `, startDotStyle, startNotifierID);
      } else if (mode === 'end') {
        let label = local && local.toDate ? local.toDate : 'To Date';
        return this.getDotDiv(`${label} `, endDotStyle, endNotifierID);
      }
    }
    return <div />;
  }
}
