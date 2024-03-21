import React from 'react';

interface Props {
  label: string;
}

export default class Label extends React.Component<Props> {
  render() {
    return (
      <div id="datepicker-fromto-label" className="pb-1 text-center font-bold dark:text-slate-300">
        {this.props.label}
      </div>
    );
  }
}
