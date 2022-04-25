import jwt from '../libs/token.js';

export default (req, res, next) => {
  // console.log(req.headers.authorization);

  try {
    if (!req.headers.authorization) {
      req.logger('authMiddleware no token');
      return res.status(401).json({ message: 'authorizationerror' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const { userId } = jwt.verify(token);
    req.userId = userId;

    req.logger(`authMiddleware token ok userId: ${userId}`);

    next();
  } catch (e) {
    req.logger(`authMiddleware error: ${e.message}`);
    return res.status(401).json({ message: e.message });
  }
};
