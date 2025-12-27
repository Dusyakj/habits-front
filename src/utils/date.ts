import { format, formatDistanceToNow } from 'date-fns';

// Type for Protobuf Timestamp
interface ProtobufTimestamp {
  seconds: number;
  nanos?: number;
}

type DateInput = string | Date | number | ProtobufTimestamp | null | undefined;

export const formatDate = (date: DateInput): string => {
  if (!date) return 'N/A';
  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'number') {
      // Unix timestamp in seconds
      dateObj = new Date(date * 1000);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (typeof date === 'object' && 'seconds' in date) {
      // Protobuf Timestamp format { seconds: number, nanos?: number }
      dateObj = new Date(date.seconds * 1000);
    } else {
      console.error('Unknown date format:', date);
      return 'Invalid date';
    }

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date value:', date);
      return 'Invalid date';
    }

    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', date);
    return 'Invalid date';
  }
};

export const formatDateTime = (date: DateInput): string => {
  if (!date) return 'N/A';
  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'number') {
      dateObj = new Date(date * 1000);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (typeof date === 'object' && 'seconds' in date) {
      // Protobuf Timestamp format
      dateObj = new Date(date.seconds * 1000);
    } else {
      console.error('Unknown datetime format:', date);
      return 'Invalid date';
    }

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid datetime value:', date);
      return 'Invalid date';
    }

    return format(dateObj, 'MMM dd, yyyy hh:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error, 'Input:', date);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: DateInput): string => {
  if (!date) return 'N/A';
  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'number') {
      dateObj = new Date(date * 1000);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (typeof date === 'object' && 'seconds' in date) {
      // Protobuf Timestamp format
      dateObj = new Date(date.seconds * 1000);
    } else {
      console.error('Unknown relative time format:', date);
      return 'Invalid date';
    }

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid relative time value:', date);
      return 'Invalid date';
    }

    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error, 'Input:', date);
    return 'Invalid date';
  }
};

export const getWeekdayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || '';
};

export const getWeekdayShort = (dayIndex: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex] || '';
};
