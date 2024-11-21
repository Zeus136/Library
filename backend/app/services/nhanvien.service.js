const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db("quanlithuvien").collection("nhanvien");
  }

  extractNhanVienData(payload) {
    const nhanvien = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
      Password: payload.Password || "11111111", // Set Password to default if empty
    };
    return nhanvien;
  }

  // Tạo mới nhân viên
  async create(payload) {
    try {
      const nhanvien = this.extractNhanVienData(payload);
      const existingNhanVien = await this.NhanVien.findOne({
        MSNV: nhanvien.MSNV,
      });
      if (existingNhanVien) {
        throw new Error("Mã nhân viên đã tồn tại.");
      }
      const result = await this.NhanVien.insertOne(nhanvien);
      if (!result || !result.insertedId) {
        throw new Error("Failed to create nhanvien");
      }
      return { _id: result.insertedId, ...nhanvien };
    } catch (error) {
      console.error("Error creating nhanvien:", error.message);
      throw new Error(`Không thể tạo nhân viên. Chi tiết: ${error.message}`);
    }
  }

  // Tìm nhân viên theo ID
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const nhanvien = await this.NhanVien.findOne({ _id: new ObjectId(id) });
      return nhanvien || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding nhanvien with ID ${id}:`, error.message);
      throw new Error(
        `Cannot find nhanvien with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm nhân viên theo MSNV
  async findByMSNV(msnv) {
    try {
      const nhanvien = await this.NhanVien.findOne({ MSNV: msnv });
      return nhanvien || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding nhanvien with MSNV ${msnv}:`, error.message);
      throw new Error(
        `Cannot find nhanvien with MSNV ${msnv}. Details: ${error.message}`
      );
    }
  }

  // Tìm tất cả nhân viên
  async findAll() {
    try {
      const nhanvien = await this.NhanVien.find().toArray();
      return nhanvien;
    } catch (error) {
      console.error("Error finding nhanvien:", error.message);
      throw new Error(`Cannot find nhanvien. Details: ${error.message}`);
    }
  }

  // Cập nhật nhân viên
  async update(id, payload) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const existingNhanVien = await this.NhanVien.findOne({
        _id: new ObjectId(id),
      });
      if (!existingNhanVien) {
        throw new Error("Nhan vien not found");
      }
      const nhanvien = this.extractNhanVienData(payload);
      if (JSON.stringify(existingNhanVien) === JSON.stringify(nhanvien)) {
        throw new Error("No information has been updated");
      }
      if (nhanvien.MSNV !== existingNhanVien.MSNV) {
        const nhanVienWithSameMSNV = await this.NhanVien.findOne({
          MSNV: nhanvien.MSNV,
        });
        if (nhanVienWithSameMSNV) {
          throw new Error("MSNV already exists");
        }
      }
      const result = await this.NhanVien.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: nhanvien },
        { returnDocument: "after" }
      );
      return result.value;
    } catch (error) {
      console.error(`Error updating nhanvien with ID ${id}:`, error.message);
      throw new Error(
        `Cannot update nhanvien with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Xóa nhân viên
  async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const result = await this.NhanVien.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting nhanvien with ID ${id}:`, error.message);
      throw new Error(
        `Cannot delete nhanvien with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Cập nhật nhân viên theo MSNV
  async updateByMSNV(msnv, payload) {
    try {
      const nhanvien = this.extractNhanVienData(payload);
      const result = await this.NhanVien.updateOne(
        { MSNV: msnv },
        { $set: nhanvien }
      );
      return result;
    } catch (error) {
      console.error(
        `Error updating nhanvien with MSNV ${msnv}:`,
        error.message
      );
      throw new Error(
        `Cannot update nhanvien with MSNV ${msnv}. Details: ${error.message}`
      );
    }
  }

  // Cập nhật mật khẩu nhân viên theo ID
  async updatePasswordById(id, password) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const result = await this.NhanVien.updateOne(
        { _id: new ObjectId(id) },
        { $set: { Password: password } }
      );
      return result;
    } catch (error) {
      console.error(
        `Error updating password for nhanvien with ID ${id}:`,
        error.message
      );
      throw new Error(
        `Cannot update password for nhanvien with ID ${id}. Details: ${error.message}`
      );
    }
  }

  async updatePasswordByMSNV(msnv, password) {
    try {
      const result = await this.NhanVien.updateOne(
        { MSNV: msnv },
        { $set: { Password: password } }
      );
      return result;
    } catch (error) {
      console.error(
        `Error updating password for nhanvien with MSNV ${msnv}:`,
        error.message
      );
      throw new Error(
        `Cannot update password for nhanvien with MSNV ${msnv}. Details: ${error.message}`
      );
    }
  }

  // Đăng nhập
  async login({ msnv, password }) {
    const nhanvien = await this.NhanVien.findOne({ MSNV: msnv });
    if (nhanvien && password === nhanvien.Password) {
      return nhanvien;
    }
    return null;
  }
}

module.exports = NhanVienService;
