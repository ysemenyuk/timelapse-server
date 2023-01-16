import bcrypt from 'bcryptjs';
import _ from 'lodash';
import jwt from '../libs/token.js';
import { BadRequestError } from '../middleware/errorHandlerMiddleware.js';
import User from '../models/User.js';
import fileService from './file.service.js';

const singUp = async ({ email, password, logger }) => {
  logger(`userService.singUp email: ${email}`);

  const user = await User.findOne({ email });

  if (user) {
    logger(`userService.singUp email ${email} - already exist`);
    throw new BadRequestError(`User with email ${email} already exist`);
  }

  const hashPassword = await bcrypt.hash(password, 8);

  const newUser = new User({ email, password: hashPassword });
  await newUser.save();

  // crete user folder
  const userFolder = await fileService.createUserFolder({
    logger,
    userId: newUser._id,
  });

  await newUser.updateOne({ userFolder: userFolder._id });

  const token = jwt.sign(newUser._id);

  return { token, user: _.pick(newUser, ['_id', 'name', 'email', 'avatar']) };
};

const logIn = async ({ email, password, logger }) => {
  logger(`userService.logIn email: ${email}`);

  const user = await User.findOne({ email });

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

  return { token, user: _.pick(user, ['_id', 'name', 'email', 'avatar']) };
};

const auth = async ({ userId, logger }) => {
  logger(`userService.auth userId: ${userId}`);

  const user = await User.findById(userId);
  const token = jwt.sign(user._id);

  return { token, user: _.pick(user, ['_id', 'name', 'email', 'avatar']) };
};

const getById = async ({ userId, logger }) => {
  logger(`user.repository.getById userId: ${userId}`);

  const user = await User.findById(userId);
  return { user: _.pick(user, ['_id', 'name', 'email', 'avatar']) };
};

const getByEmail = async ({ email, logger }) => {
  logger(`userService.getByEmail email: ${email}`);

  const user = await User.findOne({ email });
  return { user: _.pick(user, ['_id', 'name', 'email', 'avatar']) };
};

const updateOne = async ({ userId, payload, logger }) => {
  logger(`userService.updateOne userId: ${userId}`);

  const { name, email, password } = payload;

  // TODO: check email if exist

  const hashPassword = password && (await bcrypt.hash(password, 8));
  const fields = _.pickBy({ name, email, password: hashPassword }, _.identity);

  const updated = await User.findOneAndUpdate({ _id: userId }, fields, { new: true });
  return updated;
};

const deleteOne = async ({ userId, logger }) => {
  logger(`userService.deleteOne userId: ${userId}`);

  // TODO: delete all files

  const user = await User.findById(userId);
  const deleted = await user.remove();
  return deleted;
};

export default { singUp, logIn, auth, getById, getByEmail, updateOne, deleteOne };
