const jwt = require("jsonwebtoken");
const { ApiError } = require("../api-error");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Thêm thông tin người dùng vào req
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authenticate;
