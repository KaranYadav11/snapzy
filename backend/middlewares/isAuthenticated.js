import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Token Not Found" });
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, process.env.SECRET_KEY);
      if (!decodedData)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      req.id = decodedData?.userId;
    }
    next();
  } catch (error) {
    console.error(`Error 💩: ${error.message}`);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default isAuthenticated;
