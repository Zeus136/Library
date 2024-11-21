const { ApiError } = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const NhanVienService = require("../services/nhanvien.service");

// Tạo mới nhân viên
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

    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanviens = await nhanVienService.findAll();
    //Kiểm tra xem nếu mã nhân viên chưa có thì tạo tự động hoặc lấy từ request với định dang NV001, NV002, ...
    let msnv = req.body.MSNV;
    if (!msnv) {
      const lastNhanVien = nhanviens[nhanviens.length - 1];
      const lastMSNV = lastNhanVien.MSNV;
      const lastNumber = parseInt(lastMSNV.slice(2));
      msnv = `NV${(lastNumber + 1).toString().padStart(3, "0")}`;
      // Kiểm tra msnv mới tạo đã có hay chưa nếu rồi thì tăng giá trị lên 1 tới khi không còn trùng thì ngừng
      while (nhanviens.find((nhanvien) => nhanvien.MSNV === msnv)) {
        const number = parseInt(msnv.slice(2));
        msnv = `NV${(number + 1).toString().padStart(3, "0")}`;
      }
      const nhanvienData = { ...req.body, MSNV: msnv };
      const nhanvien = await nhanVienService.create(nhanvienData);
      return res.status(201).send(nhanvien);
    } else {
      const nhanvien = await nhanVienService.create(req.body);
      return res.status(201).send(nhanvien);
    }
  } catch (error) {
    return next(
      new ApiError(500, `Không thể tạo nhân viên. Chi tiết: ${error.message}`)
    );
  }
};

// Lấy tất cả nhân viên
exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanviens = await nhanVienService.findAll();
    return res.send(nhanviens);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy danh sách nhân viên. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy nhân viên theo ID
exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanvien = await nhanVienService.findById(req.params.id);

    if (!nhanvien) {
      return next(new ApiError(404, "Không tìm thấy nhân viên với ID này."));
    }

    return res.send(nhanvien);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin nhân viên với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Lấy nhân viên theo MSNV
exports.findByMSNV = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanvien = await nhanVienService.findByMSNV(req.params.msnv);

    if (!nhanvien) {
      return next(new ApiError(404, "Không tìm thấy nhân viên với MSNV này."));
    }

    return res.send(nhanvien);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể lấy thông tin nhân viên với MSNV = ${req.params.msnv}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật thông tin nhân viên
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

    const nhanVienService = new NhanVienService(MongoDB.client);
    const existingNhanVien = await nhanVienService.findById(req.params.id);
    if (!existingNhanVien) {
      return next(new ApiError(404, "Không tìm thấy nhân viên với ID này."));
    }

    const nhanvien = nhanVienService.extractNhanVienData(req.body);
    if (JSON.stringify(existingNhanVien) === JSON.stringify(nhanvien)) {
      return next(new ApiError(400, "Không có thông tin nào được cập nhật."));
    }

    if (nhanvien.MSNV !== existingNhanVien.MSNV) {
      const nhanVienWithSameMSNV = await nhanVienService.findByMSNV(
        nhanvien.MSNV
      );
      if (nhanVienWithSameMSNV) {
        return next(new ApiError(400, "Mã nhân viên không được trùng."));
      }
    }

    const updatedNhanVien = await nhanVienService.update(
      req.params.id,
      req.body
    );
    return res.send(updatedNhanVien);
  } catch (error) {
    console.error(
      `Error updating nhanvien with ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(
        500,
        `Không thể cập nhật nhân viên với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật thông tin nhân viên theo MSNV
exports.updateByMSNV = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        new ApiError(
          400,
          "Dữ liệu không hợp lệ! Không có dữ liệu trong yêu cầu."
        )
      );
    }

    const nhanVienService = new NhanVienService(MongoDB.client);
    const existingNhanVien = await nhanVienService.findByMSNV(req.params.msnv);
    if (!existingNhanVien) {
      return next(
        new ApiError(
          404,
          `Không thể cập nhật nhân viên với MSNV = ${req.params.msnv}. Chi tiết: Không tìm thấy nhân viên.`
        )
      );
    }

    const updatedData = { ...existingNhanVien, ...req.body };
    const result = await nhanVienService.updateByMSNV(
      req.params.msnv,
      updatedData
    );

    if (result.modifiedCount === 0) {
      return next(
        new ApiError(
          404,
          `Không thể cập nhật nhân viên với MSNV = ${req.params.msnv}. Chi tiết: Không tìm thấy nhân viên.`
        )
      );
    }

    return res.send({ message: "Cập nhật nhân viên thành công." });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể cập nhật nhân viên với MSNV = ${req.params.msnv}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật mật khẩu nhân viên theo ID
exports.updatePasswordById = async (req, res, next) => {
  try {
    if (!req.body || !req.body.MatKhau) {
      console.error("Invalid request: No password provided");
      return next(
        new ApiError(
          400,
          "Dữ liệu không hợp lệ! Không có mật khẩu trong yêu cầu."
        )
      );
    }

    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanvien = await nhanVienService.findById(req.params.id);

    if (!nhanvien) {
      console.error(`Nhan vien not found with ID: ${req.params.id}`);
      return next(
        new ApiError(
          404,
          `Không thể cập nhật mật khẩu. Không tìm thấy nhân viên với ID = ${req.params.id}.`
        )
      );
    }

    if (nhanvien.Password === req.body.MatKhau) {
      console.error("New password cannot be the same as the old password");
      return next(
        new ApiError(400, "Mật khẩu mới không được giống mật khẩu cũ.")
      );
    }

    const result = await nhanVienService.updatePasswordById(
      req.params.id,
      req.body.MatKhau
    );

    if (result.modifiedCount === 0) {
      console.error(`No changes made for ID: ${req.params.id}`);
      return next(
        new ApiError(
          400,
          `Không có thay đổi nào được thực hiện cho nhân viên với ID = ${req.params.id}.`
        )
      );
    }

    return res.send({ message: "Cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error(`Error updating password for ID: ${req.params.id}`, error);
    return next(
      new ApiError(
        500,
        `Không thể cập nhật mật khẩu cho nhân viên với ID = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Cập nhật mật khẩu nhân viên theo MSNV
exports.updatePasswordByMSNV = async (req, res, next) => {
  try {
    if (!req.body || !req.body.MatKhau) {
      console.error("Invalid request: No password provided");
      return next(
        new ApiError(
          400,
          "Dữ liệu không hợp lệ! Không có mật khẩu trong yêu cầu."
        )
      );
    }

    const nhanVienService = new NhanVienService(MongoDB.client);
    const nhanvien = await nhanVienService.findByMSNV(req.params.msnv);

    if (!nhanvien) {
      console.error(`Nhan vien not found with MSNV: ${req.params.msnv}`);
      return next(
        new ApiError(
          404,
          `Không thể cập nhật mật khẩu. Không tìm thấy nhân viên với MSNV = ${req.params.msnv}.`
        )
      );
    }

    if (nhanvien.Password === req.body.MatKhau) {
      console.error("New password cannot be the same as the old password");
      return next(
        new ApiError(400, "Mật khẩu mới không được giống mật khẩu cũ.")
      );
    }

    const result = await nhanVienService.updatePasswordByMSNV(
      req.params.msnv,
      req.body.MatKhau
    );

    if (result.modifiedCount === 0) {
      console.error(`No changes made for MSNV: ${req.params.msnv}`);
      return next(
        new ApiError(
          400,
          `Không có thay đổi nào được thực hiện cho nhân viên với MSNV = ${req.params.msnv}.`
        )
      );
    }

    return res.send({ message: "Cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error(
      `Error updating password for MSNV: ${req.params.msnv}`,
      error
    );
    return next(
      new ApiError(
        500,
        `Không thể cập nhật mật khẩu cho nhân viên với MSNV = ${req.params.msnv}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Xóa nhân viên theo ID
exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    await nhanVienService.delete(req.params.id);
    return res.send({ message: "Xóa nhân viên thành công." });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Không thể xóa nhân viên với id = ${req.params.id}. Chi tiết: ${error.message}`
      )
    );
  }
};

// Đăng nhập nhân viên
exports.login = async (req, res) => {
  try {
    const nhanvienService = new NhanVienService(MongoDB.client);
    const nhanvien = await nhanvienService.login(req.body);
    if (nhanvien) {
      res.status(200).json(nhanvien);
    } else {
      res.status(401).json({ message: "Invalid MSNV or password" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error during login: ${error.message}` });
  }
};
