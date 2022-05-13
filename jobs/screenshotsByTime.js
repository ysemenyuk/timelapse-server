export default (agenda, io) => {
  agenda.define('screenshotsByTime', (job) => {
    console.log('screenshotsByTime job.attrs:', job.attrs);
  });
};
