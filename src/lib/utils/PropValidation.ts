import type { ReactDateTimePickerProps} from '../ReactDateTimePicker'

export const propValidation = (props: ReactDateTimePickerProps) => {
  if (props.years) {
    const { start, end, years } = props;
    if (years[0] > years[1]) {
      return 'Start year must be before the end';
    }
    // Start year defined must be between the custom user defined dates
    const isStartYearBetweenUserDefinedYears =
      start.year() >= years[0] && start.year() <= years[1];
    // End year defined must be between the custom user defined dates
    const isEndYearBetweenUserDefinedYears =
      end.year() >= years[0] && end.year() <= years[1];
    if (!isStartYearBetweenUserDefinedYears) {
      return 'Start year should be in the custom years defined';
    }
    if (!isEndYearBetweenUserDefinedYears) {
      return 'End year should be in the custom years defined';
    }
  }
  return true;
};
