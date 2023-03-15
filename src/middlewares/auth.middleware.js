export default (container) => (req, res, next) => {
  const userService = container.userService;

  try {
    if (!req.headers.authorization) {
      req.reqLogger('authMiddleware no token');
      return res.status(401).json({ message: 'authorizationerror' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const { userId } = userService.verify(token);
    req.userId = userId;

    req.reqLogger(`authMiddleware token ok userId: ${userId}`);

    next();
  } catch (e) {
    req.reqLogger(`authMiddleware error: ${e.message}`);
    return res.status(401).json({ message: e.message });
  }
};
