import { makeTimeString } from '../utils/index.js';
import { fromUnixTime } from 'date-fns';

export const getTimeRangePhotosByTime = (photoSettings, dateInfo) => {
  const { timeRangeType } = photoSettings;

  const isAllTime = timeRangeType === 'allTime';
  const isSunTime = timeRangeType === 'sunTime';
  const isCustomTime = timeRangeType === 'customTime';

  let startTime;
  let endTime;

  if (isSunTime && dateInfo && dateInfo.weather) {
    const { weather } = dateInfo;
    startTime = makeTimeString(fromUnixTime(weather.sys.sunrise));
    endTime = makeTimeString(fromUnixTime(weather.sys.sunset));
  } else if (isCustomTime) {
    startTime = `${photoSettings.startTime}:00`;
    endTime = `${photoSettings.endTime}:00`;
  } else if (isAllTime) {
    startTime = `00:00:01`;
    endTime = `23:59:59`;
  } else {
    startTime = `08:00:00`;
    endTime = `20:00:00`;
  }

  return { startTime, endTime };
};

export const getDateRangeForVideo = (videoSettings) => {
  const { dateRangeType, dateRange, startDate, endDate } = videoSettings;

  if (dateRangeType === 'allDates') {
    return { startDate: null, endDate: null };
  }

  if (dateRange === 'lastDay') {
    //
  }

  if (dateRange === 'lastWeek') {
    //
  }

  if (dateRange === 'lastMonth') {
    //
  }

  if (startDate && endDate) {
    return { startDate, endDate };
  }

  return { startDate: null, endDate: null };
};

export const getTimeRangeForVideo = (videoSettings) => {
  const { timeRangeType, startTime, endTime } = videoSettings;

  if (timeRangeType === 'allTime') {
    return { startTime: null, endTime: null };
  }

  return { startTime, endTime };
};
