import React from 'react';
import type { ClassNames, Locale, Mode } from '../types';
import clsx from 'clsx';

interface Props {
  mode: Mode;
  selectingModeFrom: boolean;
  smartMode?: boolean;
  locale?: Locale;
  classNames?: ClassNames;
}
export default class ActiveNotifier extends React.Component<Props> {
  getDotDiv(text: string, classNames: string, id: string) {
    return (
      <div className="activeNotifier flex items-center justify-center" id={id}>
        {text} <span className={clsx('ml-2 inline-block h-3 w-3 rounded-full', classNames)} />
      </div>
    );
  }

  render() {
    let selectingModeFrom = this.props.selectingModeFrom;
    let mode = this.props.mode;
    let startDotStyle = clsx('bg-emerald-500', this.props.classNames?.startDot);

    let endDotStyle = clsx('bg-red-600', this.props.classNames?.endDot);
    let startNotifierID = 'startNotifierID';
    let endNotifierID = 'endNotifierID';
    let locale = this.props.locale;
    if (this.props.smartMode) {
      if (selectingModeFrom && mode === 'start') {
        let label = locale && locale.selectingFrom ? locale.selectingFrom : 'Selecting From';
        return this.getDotDiv(`${label} `, startDotStyle, startNotifierID);
      } else if (!selectingModeFrom && mode === 'end') {
        let label = locale && locale.selectingTo ? locale.selectingTo : 'Selecting To';
        return this.getDotDiv(`${label} `, endDotStyle, endNotifierID);
      }
    } else {
      if (mode === 'start') {
        let label = locale && locale.fromDate ? locale.fromDate : 'From Date';
        return this.getDotDiv(`${label} `, startDotStyle, startNotifierID);
      } else if (mode === 'end') {
        let label = locale && locale.toDate ? locale.toDate : 'To Date';
        return this.getDotDiv(`${label} `, endDotStyle, endNotifierID);
      }
    }
    return <div />;
  }
}
