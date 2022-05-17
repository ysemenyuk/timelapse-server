export default (agenda, io, logger) => {
  agenda.define('createVideoFile', (job) => {
    console.log('createVideoFile job.attrs:', job.attrs.data);
  });

  agenda.define('createVideoFileByTime', (job) => {
    console.log('createVideoFileByTime job.attrs:', job.attrs.data);
  });
};
