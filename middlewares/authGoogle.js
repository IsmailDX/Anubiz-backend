const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { userID: payload.userID, name: payload.name };

      return next();
    } else if (req.isAuthenticated()) {
      req.user = req.user;

      return next();
    } else {
      throw new UnauthenticatedError("Authentication invalid");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
