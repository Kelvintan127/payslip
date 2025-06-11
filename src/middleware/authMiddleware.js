import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const accessToken =
    req.headers?.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }


  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        shouldRefresh: true,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid authentication",
    });
  }
};

const roleAuthMiddleware = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};

export { authMiddleware, roleAuthMiddleware };