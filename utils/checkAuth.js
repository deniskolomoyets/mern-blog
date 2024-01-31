import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); //delate words 'Bearer' from console
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id; //I embed it in the request so that later I can pull out the user ID
      next();
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};
