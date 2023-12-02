import React from 'react';

interface Props {
  label: string;
}

export default class Label extends React.Component<Props> {
  render() {
    return (
      <div className="dateTimeLabel pb-1 text-center font-bold">
        {this.props.label}
      </div>
    );
  }
}
