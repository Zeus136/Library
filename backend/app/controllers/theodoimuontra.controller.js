const { ApiError } = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const TheodoiMuonTraService = require("../services/theodoimuontra.service");

// Tạo mới theo dõi mượn trả
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

    const theodoiMuonTraService = new TheodoiMuonTraService(MongoDB.client);
    const theodoimuontra = await theodoiMuonTraService.create(req.body);
    return res.status(201).send(theodoimuontra);
  } catch (error) {
    return next(new ApiError(500, `${error.message}`));
  }
};

// Lấy tất cả theo dõi mượn trả
exports.findAll = async (req, res, next) => {
  try {
    const theodoiMuonTraService = new TheodoiMuonTraService(MongoDB.client);
    const theodoimuontras = await theodoiMuonTraService.findAll();
    return res.send(theodoimuontras);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy danh sách theo dõi mượn trả. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy theo dõi mượn trả theo ID
exports.findOne = async (req, res, next) => {
  try {
    const theodoiMuonTraService = new TheodoiMuonTraService(MongoDB.client);
    const theodoimuontra = await theodoiMuonTraService.findById(req.params.id);

    if (!theodoimuontra) {
      return next(
        new ApiError(404, "Không tìm thấy theo dõi mượn trả với ID này.")
      );
    }

    return res.send(theodoimuontra);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin theo dõi mượn trả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật theo dõi mượn trả theo ID
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

    const theodoiMuonTraService = new TheodoiMuonTraService(MongoDB.client);
    const theodoimuontra = await theodoiMuonTraService.update(
      req.params.id,
      req.body
    );

    if (!theodoimuontra) {
      return next(
        new ApiError(404, "Không tìm thấy theo dõi mượn trả với ID này.")
      );
    }

    return res.send(theodoimuontra);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể cập nhật thông tin theo dõi mượn trả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Xóa theo dõi mượn trả theo ID
exports.delete = async (req, res, next) => {
  try {
    const theodoiMuonTraService = new TheodoiMuonTraService(MongoDB.client);
    const result = await theodoiMuonTraService.delete(req.params.id);

    if (result === 0) {
      return next(
        new ApiError(404, "Không tìm thấy theo dõi mượn trả với ID này.")
      );
    }

    return res.send({ message: "Xóa theo dõi mượn trả thành công!" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa theo dõi mượn trả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};
