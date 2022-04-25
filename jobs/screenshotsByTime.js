export default (agenda, storage, io) => {
  agenda.define('screenshotsByTime', { lockLifetime: 1000 }, (job) => {
    console.log('screenshotsByTime job.attrs:', job.attrs);
  });
};
