// import userService from '../services/user.service.js';

export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  //

  async singUp(req, res) {
    req.reqLogger(`userController.singUp /api/user/singup`);

    const { token, user } = await this.userService.singUp({
      email: req.body.email,
      password: req.body.password,
      logger: req.reqLogger,
    });

    res.status(201).send({ token, user });
    req.resLogger(req);
  }

  async logIn(req, res) {
    req.reqLogger('userController.logIn /api/user/login');

    const { token, user } = await this.userService.logIn({
      email: req.body.email,
      password: req.body.password,
      logger: req.reqLogger,
    });

    res.status(200).send({ token, user });
    req.resLogger(req);
  }

  async auth(req, res) {
    req.reqLogger('userRouter.get /api/user/auth');

    const { token, user } = await this.userService.auth({
      userId: req.userId,
      logger: req.reqLogger,
    });

    res.status(200).send({ token, user });
    req.resLogger(req);
  }

  //

  async getOne(req, res) {
    req.reqLogger(`userController.getOne`);

    const user = await this.userService.getOneById({
      userId: req.userId,
      logger: req.reqLogger,
    });

    res.status(200).send({ user });
    req.resLogger(req);
  }

  //

  async updateOne(req, res) {
    req.reqLogger(`userController.updateOne`);

    const updated = await this.userService.updateOne({
      userId: req.userId,
      payload: req.body,
      logger: req.reqLogger,
    });

    res.status(201).send({ user: updated });
    req.resLogger(req);
  }

  //

  async deleteOne(req, res) {
    req.reqLogger(`userController.deleteOne`);

    const deleted = await this.userService.deleteOne({
      userId: req.userId,
      logger: req.reqLogger,
    });

    res.status(204).send({ user: deleted });
    req.resLogger(req);
  }
}
