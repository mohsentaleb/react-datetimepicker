const customRange = { 'Custom Range': 'Custom Range' } as const;
export type PresetDateRanges = Record<string, [Date, Date]> &
  Partial<typeof customRange>;

export type Locale = {
  format?: string;
  sundayFirst?: boolean;
  days?: [string, string, string, string, string, string, string];
  months?: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  fromDate?: string;
  toDate?: string;
  selectingFrom?: string;
  selectingTo?: string;
  maxDate?: string;
  close?: string;
  apply?: string;
  cancel?: string;
};

export type ClassNames = {
  rootContainer?: string;
  rangesContainer?: string;
  rangeButtonDefault?: string;
  rangeButtonSelected?: string;
  fromToRangeContainer?: string;
  normalCell?: string;
  normalCellHover?: string
  greyCell?: string
  invalidCell?: string
  startCell?: string
  endCell?: string
  withinRangeCell?: string
  startDot?: string;
  endDot?: string;
  footerContainer?: string;
  applyButton?: string;
  cancelButton?: string;

};

export type Mode = 'start' | 'end';
export type Meridiem = 'am' | 'pm';
