export default (agenda, storage, io) => {
  agenda.define('createScreenshot', { lockLifetime: 1000 }, (job) => {
    console.log('createScreenshot job.attrs:', job.attrs);
  });
};
