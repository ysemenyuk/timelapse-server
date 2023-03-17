import { makeTimeName } from '../utils/index.js';
import { fromUnixTime } from 'date-fns';

export default (photoSettings, dateInfo) => {
  const { timeRangeType } = photoSettings;

  const isAllTime = timeRangeType === 'allTime';
  const isSunTime = timeRangeType === 'sunTime';
  const isCustomTime = timeRangeType === 'customTime';

  let startTime;
  let stopTime;

  if (isSunTime && dateInfo && dateInfo.weather) {
    const { weather } = dateInfo;
    startTime = makeTimeName(fromUnixTime(weather.sys.sunrise));
    stopTime = makeTimeName(fromUnixTime(weather.sys.sunset));
  } else if (isCustomTime) {
    const { customTimeStart, customTimeStop } = photoSettings;
    startTime = `${customTimeStart}:00`;
    stopTime = `${customTimeStop}:00`;
  } else if (isAllTime) {
    startTime = `00:00:00`;
    stopTime = `23:59:59`;
  } else {
    startTime = `08:00:00`;
    stopTime = `20:00:00`;
  }

  return { startTime, stopTime };
};
