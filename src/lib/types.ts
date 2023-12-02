import type { Moment } from 'moment-timezone';
import type { CSSProperties } from 'react';

const customRange = { 'Custom Range': 'Custom Range' } as const;
export type PresetDateRanges = Record<string, [Moment, Moment]> &
  Partial<typeof customRange>;

export type Locale = {
  format: string;
  sundayFirst: boolean;
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

export type Style = {
  standaloneLayout?: CSSProperties;
  hoverCell?: boolean;
  borderRadius: string;
  borderColour: string;
  color: string;
  backgroundColor: string;
  cursor?: string;
  opacity?: string;
  fromDate?: React.CSSProperties;
  toDate?: React.CSSProperties;
  betweenDates?: React.CSSProperties;
  fromDot?: React.CSSProperties;
  toDot?: React.CSSProperties;
};

export type Mode = 'start' | 'end';
export type Meridiem = 'am' | 'pm';
