import format from 'date-fns/format/index.js';

export const promisifyUploadStream = (uploadStream) => {
  return new Promise((resolve, reject) => {
    uploadStream.on('error', () => {
      // console.log('error file uploadStream stream');
      reject('error file uploadStream stream');
    });

    uploadStream.on('finish', () => {
      // console.log('finish uploadStream stream');
      resolve('finish file uploadStream stream');
    });
  });
};

export const dd = (num) => (num < 10 ? `0${num}` : `${num}`);

export const parseTime = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();
  const hh = time.getHours();
  const mm = time.getMinutes();
  const ss = time.getSeconds();

  return {
    year,
    month: dd(month + 1),
    date: dd(date),
    hh: dd(hh),
    mm: dd(mm),
    ss: dd(ss),
  };
};

export const getCurrentTime = (date) => {
  return format(date, 'hh:mm');
};

export const makeUserDirName = (userId) => {
  return `user_${userId.toString()}`;
};

export const makeCameraDirName = (cameraId) => {
  return `camera_${cameraId.toString()}`;
};

export const makeCurrentDateName = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const makeCurrentMonthName = (date) => {
  return format(date, 'yyyy-MM');
};

export const makePhotoName = (date) => {
  return format(date, 'yyyy.MM.dd hh:mm:ss');
};

export const makePhotoNameOnDisk = (date) => {
  return `img--${format(date, 'yyyy-MM-dd--hh-mm-ss')}.jpg`;
};

export const makeVideoName = (date) => {
  return format(date, 'yyyy.MM.dd hh:mm:ss');
};

export const makeVideoNameOnDisk = (date) => {
  return `video--${format(date, 'yyyy-MM-dd--hh-mm-ss')}.mp4`;
};

export const makeNum = (num) => {
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
