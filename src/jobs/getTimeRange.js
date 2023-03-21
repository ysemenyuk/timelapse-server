import { makeTimeString } from '../utils/index.js';
import { fromUnixTime } from 'date-fns';

export default (photoSettings, dateInfo) => {
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
