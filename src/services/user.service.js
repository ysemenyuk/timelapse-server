import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { userRepo } from '../db/index.js';
import { fileService } from './index.js';
import { BadRequestError } from '../errors.js';
import config from '../config.js';

const fields = ['_id', 'name', 'email', 'avatar'];
const filterProps = (user) => _.pick(user, fields);

//

export default class UserService {
  constructor() {
    //
  }

  //

  sign(userId) {
    return jwt.sign({ userId }, config.secretkey, { expiresIn: '1h' });
  }

  verify(token) {
    return jwt.verify(token, config.secretkey);
  }

  async getHashPassword(pass) {
    if (!pass) {
      return null;
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(pass, salt);

    return hashPassword;
  }

  async comparePasswords(password, hashPassword) {
    const isValid = await bcrypt.compare(password, hashPassword);
    return isValid;
  }

  //

  async singUp({ email, password, logger }) {
    logger(`userService.singUp email: ${email}`);

    const user = await userRepo.findOne({ email });

    if (user) {
      logger(`userService.singUp email ${email} - already exist`);
      throw new BadRequestError(`User with email ${email} already exist`);
    }

    const hashPassword = await this.getHashPassword(password);
    const newUser = await userRepo.create({ email, password: hashPassword });

    // crete user folder
    await fileService.createUserFolder({
      logger,
      userId: newUser._id,
    });

    const token = this.sign(newUser._id);

    return { token, user: filterProps(newUser) };
  }

  //

  async logIn({ email, password, logger }) {
    logger(`userService.logIn email: ${email}`);

    const user = await userRepo.findOne({ email });

    if (!user) {
      logger(`userService.logIn email ${email} - User not found`);
      throw new BadRequestError(`Invalid email`);
    }

    const isPassValid = await this.comparePasswords(password, user.password);

    if (!isPassValid) {
      logger(`userService.logIn email ${email} - Invalid password`);
      throw new BadRequestError(`Invalid password`);
    }

    const token = this.sign(user._id);

    return { token, user: filterProps(user) };
  }

  //

  async auth({ userId, logger }) {
    logger(`userService.auth userId: ${userId}`);

    const user = await userRepo.findOneById(userId, fields);
    const token = this.sign(user._id);

    return { token, user };
  }

  //

  async getOneById({ userId, logger }) {
    logger(`userService.getById userId: ${userId}`);

    const user = await userRepo.findOneById(userId, fields);
    return { user };
  }

  //

  async getOneByEmail({ email, logger }) {
    logger(`userService.getOneByEmail email: ${email}`);

    const user = await userRepo.findOne({ email }, fields);
    return { user };
  }

  //

  async updateOne({ userId, payload, logger }) {
    logger(`userService.updateOne userId: ${userId}`);

    const { name, email, password } = payload;

    // TODO: check email if exist

    const hashPassword = await this.getHashPassword(password);

    const fields = _.pickBy({ name, email, password: hashPassword }, _.identity);

    const updated = await userRepo.updateOneById(userId, fields);
    return { user: filterProps(updated) };
  }

  //

  async deleteOne({ userId, logger }) {
    logger(`userService.deleteOne userId: ${userId}`);

    // TODO: delete user cameras, files, tasks, jobs

    const deleted = await userRepo.deleteOneById(userId);
    return deleted;
  }
}
