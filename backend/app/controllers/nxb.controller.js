const { ApiError } = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const NxbService = require("../services/nxb.service");

// Tạo mới nhà xuất bản
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

    const nxbService = new NxbService(MongoDB.client);
    const nxbs = await nxbService.findAll();
    // Kiểm tra xem nếu mã NXB chưa có thì tạo tự động hoặc lấy từ request với định dạng NXB001, NXB002, ...
    let maNXB = req.body.MaNXB;
    if (!maNXB) {
      const lastNXB = nxbs[nxbs.length - 1];
      const lastMaNXB = lastNXB.MaNXB;
      const lastNumber = parseInt(lastMaNXB.slice(3));
      maNXB = `NXB${(lastNumber + 1).toString().padStart(3, "0")}`;
      // Kiểm tra maNXB mới tạo đã có hay chưa nếu rồi thì tăng giá trị lên 1 tới khi không còn trùng thì ngừng
      while (nxbs.find((nxb) => nxb.MaNXB === maNXB)) {
        const number = parseInt(maNXB.slice(3));
        maNXB = `NXB${(number + 1).toString().padStart(3, "0")}`;
      }
      const nxbData = { ...req.body, MaNXB: maNXB };
      const nxb = await nxbService.create(nxbData);
      return res.status(201).send(nxb);
    } else {
      const nxb = await nxbService.create(req.body);
      return res.status(201).send(nxb);
    }
  } catch (error) {
    console.error("Error creating nxb:", error.message);
    return next(
      new ApiError(
        500,
        `Không thể tạo nhà xuất bản. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy tất cả nhà xuất bản
exports.findAll = async (req, res, next) => {
  try {
    const nxbService = new NxbService(MongoDB.client);
    const nxbs = await nxbService.findAll();
    return res.send(nxbs);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy danh sách nhà xuất bản. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy nhà xuất bản theo ID
exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NxbService(MongoDB.client);
    const nxb = await nxbService.findById(req.params.id);

    if (!nxb) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản với ID này."));
    }

    return res.send(nxb);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin nhà xuất bản với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật nhà xuất bản theo ID
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

    const nxbService = new NxbService(MongoDB.client);
    const nxb = await nxbService.update(req.params.id, req.body);
    if (nxb === 0) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản với ID này."));
    }
    return res.send({ message: "Cập nhật nhà xuất bản thành công!" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể cập nhật nhà xuất bản với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Xóa nhà xuất bản theo ID
exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NxbService(MongoDB.client);
    const result = await nxbService.delete(req.params.id);

    if (result === 0) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản với ID này."));
    }

    return res.send({ message: "Xóa nhà xuất bản thành công!" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa nhà xuất bản với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};
