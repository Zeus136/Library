const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db("quanlithuvien").collection("sach");
    this.client = client;
  }

  getTheodoiMuonTraService() {
    const TheodoiMuonTraService = require("./theodoimuontra.service");
    return new TheodoiMuonTraService(this.client);
  }

  // Phương thức để lọc dữ liệu từ payload
  extractSachData(payload) {
    const sach = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB,
      NguonGoc: payload.NguonGoc,
    };

    // Loại bỏ các trường có giá trị là `undefined`
    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key]
    );
    return sach;
  }

  // Tạo hoặc cập nhật sách mới
  async create(payload) {
    try {
      const sach = this.extractSachData(payload);
      const existingSach = await this.Sach.findOne({ MaSach: sach.MaSach });
      if (existingSach) {
        throw new Error("Mã sách đã tồn tại.");
      }
      const result = await this.Sach.insertOne(sach);
      if (!result || !result.insertedId) {
        throw new Error("Failed to create sach");
      }
      return { _id: result.insertedId, ...sach };
    } catch (error) {
      console.error("Error creating sach:", error.message);
      throw new Error(`Không thể tạo sách. Chi tiết: ${error.message}`);
    }
  }

  // Tìm sách theo ID
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const sach = await this.Sach.findOne({ _id: new ObjectId(id) });
      return sach || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding sach with ID ${id}:`, error.message);
      throw new Error(
        `Cannot find sach with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm tất cả sách
  async findAll() {
    try {
      const sach = await this.Sach.find().toArray();
      return sach;
    } catch (error) {
      console.error("Error finding sach:", error.message);
      throw new Error(`Cannot find sach. Details: ${error.message}`);
    }
  }

  // Cập nhật sách
  async update(id, payload) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const existingSach = await this.Sach.findOne({ _id: new ObjectId(id) });
      if (!existingSach) {
        throw new Error("Không tìm thấy sách với ID này.");
      }
      const sach = this.extractSachData(payload);

      // Check if the new quantity is less than the number of books currently borrowed
      if (sach.SoQuyen < existingSach.SoQuyen) {
        const borrowedCount = await this.countBorrowedBooks(
          existingSach.MaSach
        );
        if (sach.SoQuyen < borrowedCount) {
          throw new Error(
            "Số lượng sách mới không thể nhỏ hơn số lượng sách đang cho mượn."
          );
        }
      }

      if (JSON.stringify(existingSach) === JSON.stringify(sach)) {
        throw new Error("Không có thông tin nào được cập nhật.");
      }
      if (sach.MaSach !== existingSach.MaSach) {
        const sachWithSameMaSach = await this.Sach.findOne({
          MaSach: sach.MaSach,
        });
        if (sachWithSameMaSach) {
          throw new Error("Mã sách không được trùng.");
        }
      }
      const result = await this.Sach.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: sach },
        { returnDocument: "after" }
      );
      return result.value;
    } catch (error) {
      console.error(`Error updating sach with ID ${id}:`, error.message);
      throw new Error(`${error.message}`);
    }
  }

  // Đếm số lượng sách đang mượn theo mã sách
  async countBorrowedBooks(maSach) {
    try {
      const theodoiMuonTraService = this.getTheodoiMuonTraService();
      const count = await theodoiMuonTraService.countByMaSach(maSach);
      return count;
    } catch (error) {
      console.error(
        `Error counting borrowed books for MaSach ${maSach}:`,
        error.message
      );
      throw new Error(
        `Cannot count borrowed books for MaSach ${maSach}. Details: ${error.message}`
      );
    }
  }

  // Xóa sách
  async delete(id, maSach) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      // Check if the book is currently borrowed
      const theodoiMuonTraService = this.getTheodoiMuonTraService();
      const borrowedCount = await theodoiMuonTraService.countByMaSach(maSach);
      if (borrowedCount > 0) {
        throw new Error("Không thể xóa sách đang được mượn.");
      }

      const result = await this.Sach.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        throw new Error("Không tìm thấy sách với ID này.");
      }
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting sach with ID ${id}:`, error.message);
      throw new Error(
        `Cannot delete sach with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm sách theo mã sách
  async findByMaSach(maSach) {
    try {
      const sach = await this.Sach.findOne({ MaSach: maSach });
      return sach || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding sach with MaSach ${maSach}:`, error.message);
      throw new Error(
        `Cannot find sach with MaSach ${maSach}. Details: ${error.message}`
      );
    }
  }
}

module.exports = SachService;
