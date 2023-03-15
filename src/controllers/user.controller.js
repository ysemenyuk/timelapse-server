// import userService from '../services/user.service.js';

export default class UserController {
  constructor(container) {
    this.userService = container.userService;
  }

  //

  async singUp(req, res) {
    req.reqLogger(`userController.singUp /api/user/singup`);

    const { token, user } = await this.userService.singUp({
      logger: req.reqLogger,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).send({ token, user });
    req.resLogger(req);
  }

  async logIn(req, res) {
    req.reqLogger('userController.logIn /api/user/login');

    const { token, user } = await this.userService.logIn({
      logger: req.reqLogger,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).send({ token, user });
    req.resLogger(req);
  }

  async auth(req, res) {
    req.reqLogger('userRouter.get /api/user/auth');

    const { token, user } = await this.userService.auth({
      logger: req.reqLogger,
      userId: req.userId,
    });

    res.status(200).send({ token, user });
    req.resLogger(req);
  }

  //

  async getOne(req, res) {
    req.reqLogger(`userController.getOne`);

    const user = await this.userService.getOneById({
      logger: req.reqLogger,
      userId: req.userId,
    });

    res.status(200).send({ user });
    req.resLogger(req);
  }

  //

  async updateOne(req, res) {
    req.reqLogger(`userController.updateOne`);

    const updated = await this.userService.updateOne({
      logger: req.reqLogger,
      userId: req.userId,
      payload: req.body,
    });

    res.status(201).send({ user: updated });
    req.resLogger(req);
  }

  //

  async deleteOne(req, res) {
    req.reqLogger(`userController.deleteOne`);

    const deleted = await this.userService.deleteOne({
      logger: req.reqLogger,
      userId: req.userId,
    });

    res.status(204).send({ user: deleted });
    req.resLogger(req);
  }
}
