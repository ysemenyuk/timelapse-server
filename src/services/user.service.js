import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors.js';

const userFields = ['_id', 'name', 'email', 'avatar'];
const userEntity = (user) => _.pick(user, userFields);

//

export default class UserService {
  constructor(userRepo, fileService, config) {
    this.userRepo = userRepo;
    this.fileService = fileService;
    this.config = config;
  }

  //

  sign(userId) {
    return jwt.sign({ userId }, this.config.secretkey, { expiresIn: '1h' });
  }

  verify(token) {
    return jwt.verify(token, this.config.secretkey);
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

    const user = await this.userRepo.findOne({ email });

    if (user) {
      logger(`userService.singUp email ${email} - already exist`);
      throw new BadRequestError(`User with email ${email} already exist`);
    }

    const hashPassword = await this.getHashPassword(password);
    const newUser = await this.userRepo.create({ email, password: hashPassword });

    // crete user folder
    // if error send error but user created!
    await this.fileService.createUserFolder({
      logger,
      userId: newUser._id,
    });

    const token = this.sign(newUser._id);

    return { token, user: userEntity(newUser) };
  }

  //

  async logIn({ email, password, logger }) {
    logger(`userService.logIn email: ${email}`);

    const user = await this.userRepo.findOne({ email });

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

    return { token, user: userEntity(user) };
  }

  //

  async auth({ userId, logger }) {
    logger(`userService.auth userId: ${userId}`);

    const user = await this.userRepo.findOneById(userId, userFields);
    const token = this.sign(user._id);

    return { token, user };
  }

  //

  async getOneById({ userId, logger }) {
    logger(`userService.getById userId: ${userId}`);

    const user = await this.userRepo.findOneById(userId, userFields);
    return { user };
  }

  //

  async getOneByEmail({ email, logger }) {
    logger(`userService.getOneByEmail email: ${email}`);

    const user = await this.userRepo.findOne({ email }, userFields);
    return { user };
  }

  //

  async updateOne({ userId, payload, logger }) {
    logger(`userService.updateOne userId: ${userId}`);

    const { name, email, password } = payload;

    // TODO: check email if exist

    const hashPassword = await this.getHashPassword(password);

    const fields = _.pickBy({ name, email, password: hashPassword }, _.identity);

    const updated = await this.userRepo.updateOneById(userId, fields);
    return { user: userEntity(updated) };
  }

  //

  async deleteOne({ userId, logger }) {
    logger(`userService.deleteOne userId: ${userId}`);

    // TODO: delete user cameras, files, tasks, jobs

    const deleted = await this.userRepo.deleteOneById(userId);
    return deleted;
  }
}
