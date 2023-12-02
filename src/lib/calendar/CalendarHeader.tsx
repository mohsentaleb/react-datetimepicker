import React from 'react';

interface Props {
  headers: string[];
}

export default class CalendarHeader extends React.Component<Props> {
  mapHeaderToDiv(headers: string[]) {
    return headers.map(function (header, i) {
      return (
        <div key={i} className="">
          {header}
        </div>
      );
    });
  }

  render() {
    let headerDivs = this.mapHeaderToDiv(this.props.headers);
    return (
      <div className="my-2 grid grid-cols-7 text-center">{headerDivs}</div>
    );
  }
}
