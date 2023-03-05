import bcrypt from 'bcryptjs';
import _ from 'lodash';
import jwt from './token.service.js';
import { BadRequestError } from '../middleware/errorHandlerMiddleware.js';
import { userRepo } from '../db/index.js';
import fileService from './file.service.js';

//

const filterProps = (user) => _.pick(user, ['_id', 'name', 'email', 'avatar']);

//

const singUp = async ({ email, password, logger }) => {
  logger(`userService.singUp email: ${email}`);

  const user = await userRepo.findOne({ email });

  if (user) {
    logger(`userService.singUp email ${email} - already exist`);
    throw new BadRequestError(`User with email ${email} already exist`);
  }

  const hashPassword = await bcrypt.hash(password, 8);
  const newUser = userRepo.create({ email, password: hashPassword });

  // crete user folder
  await fileService.createUserFolder({
    logger,
    userId: newUser._id,
  });

  await newUser.save();
  const token = jwt.sign(newUser._id);

  return { token, user: filterProps(newUser) };
};

//

const logIn = async ({ email, password, logger }) => {
  logger(`userService.logIn email: ${email}`);

  const user = await userRepo.findOne({ email });

  if (!user) {
    logger(`userService.logIn email ${email} - User not found`);
    throw new BadRequestError(`Invalid email`);
  }

  const isPassValid = bcrypt.compareSync(password, user.password);

  if (!isPassValid) {
    logger(`userService.logIn email ${email} - Invalid password`);
    throw new BadRequestError(`Invalid password`);
  }

  const token = jwt.sign(user._id);

  return { token, user: filterProps(user) };
};

//

const auth = async ({ userId, logger }) => {
  logger(`userService.auth userId: ${userId}`);

  const user = await userRepo.findOneById(userId);
  const token = jwt.sign(user._id);

  return { token, user: filterProps(user) };
};

//

const getOneById = async ({ userId, logger }) => {
  logger(`userService.getById userId: ${userId}`);

  const user = await userRepo.findOneById(userId);
  return { user: filterProps(user) };
};

//

const getOneByEmail = async ({ email, logger }) => {
  logger(`userService.getOneByEmail email: ${email}`);

  const user = await userRepo.findOne({ email });
  return { user: filterProps(user) };
};

//

const updateOne = async ({ userId, payload, logger }) => {
  logger(`userService.updateOne userId: ${userId}`);

  const { name, email, password } = payload;

  // TODO: check email if exist

  const hashPassword = password && (await bcrypt.hash(password, 8));
  const fields = _.pickBy({ name, email, password: hashPassword }, _.identity);

  const updated = await userRepo.updateOneById(userId, fields);
  return updated;
};

//

const deleteOne = async ({ userId, logger }) => {
  logger(`userService.deleteOne userId: ${userId}`);

  // TODO: delete user cameras, files, tasks, jobs

  const deleted = await userRepo.deleteOneById(userId);
  return deleted;
};

export default { singUp, logIn, auth, getOneById, getOneByEmail, updateOne, deleteOne };
