export default (agenda, io) => {
  agenda.define('consoleLog', { lockLifetime: 1000 }, (job) => {
    console.log('consoleLog job.attrs:', job.attrs.data);
  });
};
