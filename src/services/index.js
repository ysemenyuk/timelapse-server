import _ from 'lodash';
import taskService from './task.service.js';

const services = { taskService };

export default async (repos) => {
  const c = new Map();
  _.forEach(services, (name, Service) => c.set(name, new Service(repos)));
  return c;
};
