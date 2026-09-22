const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const isBlacklisted = await blacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  const isBlacklisted = await blacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  } 

  try{
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decode._id);
    req.captain = captain;
    return next();
  }catch(error){
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

}
