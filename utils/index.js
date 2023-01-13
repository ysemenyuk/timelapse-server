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
    month,
    date,
    hh,
    mm,
    ss,
  };
};

export const makeUserFolderName = (userId) => {
  return `user_${userId.toString()}`;
};

export const makeCameraFolderName = (cameraId) => {
  return `camera_${cameraId.toString()}`;
};

export const makeTodayName = (time) => {
  const { year, month, date } = parseTime(time);
  return `${year}-${dd(month + 1)}-${dd(date)}`;
};

export const makeMonthName = (time) => {
  const { year, month } = parseTime(time);
  return `${year}-${dd(month + 1)}`;
};

export const makeFileNameOnDisk = (time) => {
  const { year, month, date, hh, mm, ss } = parseTime(time);
  return `img--${year}-${dd(month + 1)}-${dd(date)}--${dd(hh)}-${dd(mm)}-${dd(ss)}.jpg`;
};

export const makeFileName = (time) => {
  const { year, month, date, hh, mm, ss } = parseTime(time);
  return `${year}.${dd(month + 1)}.${dd(date)} ${dd(hh)}:${dd(mm)}:${dd(ss)}`;
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
