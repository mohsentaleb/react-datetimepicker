import { getYear } from 'date-fns';
import type { ReactDateTimePickerProps } from '../ReactDateTimePicker';

export const propValidation = (props: ReactDateTimePickerProps) => {
  if (props.years) {
    const { start, end, years } = props;
    if (years[0] > years[1]) {
      return 'Start year must be before the end';
    }
    // Start year defined must be between the custom user defined dates
    const isStartYearBetweenUserDefinedYears =
      getYear(start) >= years[0] && getYear(start) <= years[1];
    // End year defined must be between the custom user defined dates
    const isEndYearBetweenUserDefinedYears =
      getYear(end) >= years[0] && getYear(end) <= years[1];
    if (!isStartYearBetweenUserDefinedYears) {
      return 'Start year should be in the custom years defined';
    }
    if (!isEndYearBetweenUserDefinedYears) {
      return 'End year should be in the custom years defined';
    }
  }
  return true;
};
