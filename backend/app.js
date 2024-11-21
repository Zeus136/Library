const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error.js");
require("dotenv").config();

const app = express();
const sachRouter = require("./app/routes/sach.route");
const nxbRouter = require("./app/routes/nxb.route");
const docgiaRouter = require("./app/routes/docgia.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const theodoimuontraRouter = require("./app/routes/theodoimuontra.route");

app.use(cors());
app.use(express.json());

// Định nghĩa route cho API sách
app.use("/api/sach", sachRouter);

// Định nghĩa route cho API nhà xuất bản
app.use("/api/nxb", nxbRouter);

// Định nghĩa route cho API độc giả
app.use("/api/docgia", docgiaRouter);

// Định nghĩa route cho API nhân viên
app.use("/api/nhanvien", nhanvienRouter);

// Định nghĩa route cho API theo dõi mượn trả
app.use("/api/theodoimuontra", theodoimuontraRouter);

// Route chính (trang chủ)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Library app" });
});

// Middleware xử lý khi không tìm thấy route
app.use((req, res, next) => {
  return next(new ApiError(404, "Khong có route nay tren server!"));
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Loi khi chay server" });
});

module.exports = app;
