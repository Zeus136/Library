const { ApiError } = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");

// Tạo mới độc giả
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

    const docGiaService = new DocGiaService(MongoDB.client);
    const docgias = await docGiaService.findAll();
    let maDocGia = req.body.MaDocGia;
    if (!maDocGia) {
      const lastDocGia = docgias[docgias.length - 1];
      const lastMaDocGia = lastDocGia.MaDocGia;
      const lastNumber = parseInt(lastMaDocGia.slice(2));
      maDocGia = `DG${(lastNumber + 1).toString().padStart(3, "0")}`;
      while (docgias.find((docgia) => docgia.MaDocGia === maDocGia)) {
        const number = parseInt(maDocGia.slice(2));
        maDocGia = `DG${(number + 1).toString().padStart(3, "0")}`;
      }
      const docgiaData = { ...req.body, MaDocGia: maDocGia };
      const docgia = await docGiaService.create(docgiaData);
      return res.status(201).send(docgia);
    } else {
      const docgia = await docGiaService.create(req.body);
      return res.status(201).send(docgia);
    }
  } catch (error) {
    return next(
      new ApiError(500, `Không thể tạo độc giả. Chi tiết: ${error.message}`)
    );
  }
};

// Lấy tất cả độc giả
exports.findAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const docgias = await docGiaService.findAll();
    return res.send(docgias);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy danh sách độc giả. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy độc giả theo ID
exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const docgia = await docGiaService.findById(req.params.id);

    if (!docgia) {
      return next(new ApiError(404, "Không tìm thấy độc giả với ID này."));
    }

    return res.send(docgia);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin độc giả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật thông tin độc giả
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

    const docGiaService = new DocGiaService(MongoDB.client);
    const docgia = await docGiaService.update(req.params.id, req.body);
    return res.send(docgia);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể cập nhật thông tin độc giả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Xóa độc giả theo ID
exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    await docGiaService.delete(req.params.id);
    return res.send({ message: "Xóa độc giả thành công." });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa độc giả với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};
