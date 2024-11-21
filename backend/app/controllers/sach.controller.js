const { ApiError } = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const SachService = require("../services/sach.service");

// Tạo mới sách
exports.create = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        new ApiError(
          400,
          "Dữ liệu không hợp lệ! Không có dữ liệu trong yêu cầu."
        )
      );
    }

    const sachService = new SachService(MongoDB.client);
    const sachs = await sachService.findAll();
    // Kiểm tra xem nếu mã sách chưa có thì tạo tự động hoặc lấy từ request với định dạng S001, S002, ...
    let maSach = req.body.MaSach;
    if (!maSach) {
      const lastSach = sachs[sachs.length - 1];
      const lastMaSach = lastSach.MaSach;
      const lastNumber = parseInt(lastMaSach.slice(1));
      maSach = `S${(lastNumber + 1).toString().padStart(3, "0")}`;
      // Kiểm tra maSach mới tạo đã có hay chưa nếu rồi thì tăng giá trị lên 1 tới khi không còn trùng thì ngừng
      while (sachs.find((sach) => sach.MaSach === maSach)) {
        const number = parseInt(maSach.slice(1));
        maSach = `S${(number + 1).toString().padStart(3, "0")}`;
      }
      const sachData = { ...req.body, MaSach: maSach };
      const sach = await sachService.create(sachData);
      return res.status(201).send(sach);
    } else {
      const sach = await sachService.create(req.body);
      return res.status(201).send(sach);
    }
  } catch (error) {
    return next(
      new ApiError(500, `Không thể tạo sách. Chi tiết: ${error.message}`)
    );
  }
};

// Lấy tất cả sách
exports.findAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const sachs = await sachService.findAll();
    return res.send(sachs);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy danh sách sách. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy sách theo ID
exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const sach = await sachService.findById(req.params.id);

    if (!sach) {
      return next(new ApiError(404, "Không tìm thấy sách với ID này."));
    }

    return res.send(sach);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin sách với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật sách theo ID
exports.update = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        new ApiError(
          400,
          "Dữ liệu không hợp lệ! Không có dữ liệu trong yêu cầu."
        )
      );
    }

    const sachService = new SachService(MongoDB.client);
    const sach = await sachService.update(req.params.id, req.body);
    if (sach === 0) {
      return next(new ApiError(404, "Không tìm thấy sách với ID này."));
    }
    return res.send({ message: "Cập nhật sách thành công!" });
  } catch (error) {
    return next(new ApiError(500, `${error.message}`));
  }
};

// Xóa sách theo ID
exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const sach = await sachService.findById(req.params.id);

    if (!sach) {
      return next(new ApiError(404, "Không tìm thấy sách với ID này."));
    }

    // Đếm số lượng sách đang mượn của mã sách
    const borrowedCount = await sachService.countBorrowedBooks(sach.MaSach);
    if (borrowedCount > 0) {
      return next(new ApiError(400, "Không thể xóa sách đang được mượn."));
    }

    const result = await sachService.delete(req.params.id, sach.MaSach);

    if (result === 0) {
      return next(new ApiError(404, "Không tìm thấy sách với ID này."));
    }

    return res.send({ message: "Xóa sách thành công!" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa sách với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};
