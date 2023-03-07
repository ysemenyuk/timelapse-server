import { userService } from '../services/index.js';

const singUp = async (req, res) => {
  req.reqLogger(`userController.singUp /api/user/singup`);

  const { token, user } = await userService.singUp({
    email: req.body.email,
    password: req.body.password,
    logger: req.reqLogger,
  });

  res.status(201).send({ token, user });
  req.resLogger(req);
};

const logIn = async (req, res) => {
  req.reqLogger('userController.logIn /api/user/login');

  const { token, user } = await userService.logIn({
    email: req.body.email,
    password: req.body.password,
    logger: req.reqLogger,
  });

  res.status(200).send({ token, user });
  req.resLogger(req);
};

const auth = async (req, res) => {
  req.reqLogger('userRouter.get /api/user/auth');

  const { token, user } = await userService.auth({
    userId: req.userId,
    logger: req.reqLogger,
  });

  res.status(200).send({ token, user });
  req.resLogger(req);
};

const getOne = async (req, res) => {
  req.reqLogger(`userController.getOne`);

  const user = await userService.getOneById({
    userId: req.userId,
    logger: req.reqLogger,
  });

  res.status(200).send({ user });
  req.resLogger(req);
};

const updateOne = async (req, res) => {
  req.reqLogger(`userController.updateOne`);

  const updated = await userService.updateOne({
    userId: req.userId,
    payload: req.body,
    logger: req.reqLogger,
  });

  res.status(201).send({ user: updated });
  req.resLogger(req);
};

const deleteOne = async (req, res) => {
  req.reqLogger(`userController.deleteOne`);

  const deleted = await userService.deleteOne({
    userId: req.userId,
    logger: req.reqLogger,
  });

  res.status(204).send({ user: deleted });
  req.resLogger(req);
};

export default { singUp, logIn, auth, getOne, updateOne, deleteOne };
