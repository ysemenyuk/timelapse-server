import userService from '../services/user.service.js';

export default () => {
  const singUp = async (req, res) => {
    req.logger(`userController.singUp /api/user/singup`);

    const { token, user } = await userService.singUp({
      email: req.body.email,
      password: req.body.password,
      logger: req.logger,
    });

    res.status(201).send({ token, user });
    req.logResp(req);
  };

  const logIn = async (req, res) => {
    req.logger('userController.logIn /api/user/login');

    const { token, user } = await userService.logIn({
      email: req.body.email,
      password: req.body.password,
      logger: req.logger,
    });

    res.status(200).send({ token, user });
    req.logResp(req);
  };

  const auth = async (req, res) => {
    req.logger('userRouter.get /api/user/auth');

    const { token, user } = await userService.auth({
      userId: req.userId,
      logger: req.logger,
    });

    res.status(200).send({ token, user });
    req.logResp(req);
  };

  const getOne = async (req, res) => {
    req.logger(`userController.getOne userId: ${req.userId}`);

    const user = await userService.getById({
      userId: req.userId,
      logger: req.logger,
    });

    res.status(200).send({ user });
    req.logResp(req);
  };

  const updateOne = async (req, res) => {
    req.logger(`userController.updateOne userId: ${req.userId}`);

    const updated = await userService.updateOne({
      userId: req.userId,
      payload: req.body,
      logger: req.logger,
    });

    res.status(201).send({ user: updated });
    req.logResp(req);
  };

  const deleteOne = async (req, res) => {
    req.logger(`userController.deleteOne userId: ${req.userId}`);

    const deleted = await userService.deleteOne({
      userId: req.userId,
      logger: req.logger,
    });

    res.status(204).send({ user: deleted });
    req.logResp(req);
  };

  return { singUp, logIn, auth, getOne, updateOne, deleteOne };
};
