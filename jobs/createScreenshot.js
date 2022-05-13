export default (agenda, io) => {
  agenda.define('createScreenshot', (job) => {
    console.log('createScreenshot job.attrs:', job.attrs);
  });
};
