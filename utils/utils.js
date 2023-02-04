import format from 'date-fns/format/index.js';
import { type } from './constants.js';

export const isPhotoFile = (file) => {
  return file && file.type === type.PHOTO;
};

export const makeUserDirName = (userId) => {
  return `u_${userId.toString()}`;
};

export const makeCameraDirName = (cameraId) => {
  return `c_${cameraId.toString()}`;
};

export const makePhotoFileName = (date) => {
  return `photo--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.jpg`;
};

export const makeVideoFileName = (date) => {
  return `video--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.mp4`;
};

export const makePosterFileName = (date) => {
  return `poster--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.jpg`;
};

//

export const makeDateAndTimeName = (date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

export const makeTimeName = (date) => {
  return format(date, 'HH:mm:ss');
};

export const makeDateName = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const makeMonthName = (date) => {
  return format(date, 'yyyy-MM');
};

//

export const makeNumber = (num) => {
  if (num < 10) {
    return `00000${num}`;
  }
  if (num >= 10 && num < 100) {
    return `0000${num}`;
  }
  if (num >= 100 && num < 1000) {
    return `000${num}`;
  }
  if (num >= 1000 && num < 10000) {
    return `00${num}`;
  }
  if (num >= 10000 && num < 100000) {
    return `0${num}`;
  }
  return num;
};

export const dd = (num) => (num < 10 ? `0${num}` : `${num}`);

// export const parseTime = (time) => {
//   const year = time.getFullYear();
//   const month = time.getMonth();
//   const date = time.getDate();
//   const hh = time.getHours();
//   const mm = time.getMinutes();
//   const ss = time.getSeconds();

//   return {
//     year,
//     month: dd(month + 1),
//     date: dd(date),
//     hh: dd(hh),
//     mm: dd(mm),
//     ss: dd(ss),
//   };
// };

// export const msToTime = (duration) => {
//   let milliseconds = parseInt((duration%1000))
//   let seconds = parseInt((duration/1000)%60)
//   let minutes = parseInt((duration/(1000*60))%60)
//   let hours = parseInt((duration/(1000*60*60))%24);

//   hours = (hours < 10) ? "0" + hours : hours;
//   minutes = (minutes < 10) ? "0" + minutes : minutes;
//   seconds = (seconds < 10) ? "0" + seconds : seconds;

//   return hours + ":" + minutes + ":" + seconds;
// };
