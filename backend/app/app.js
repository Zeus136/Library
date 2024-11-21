const express = require("express");
const cors = require("cors");
const sachRouter = require("./routes/sach.route");
const nhanvienRouter = require("./routes/nhanvien.route");
const nxbRouter = require("./routes/nxb.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sach", sachRouter);
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/nxb", nxbRouter);

module.exports = app;
