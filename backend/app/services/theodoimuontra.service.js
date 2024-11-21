const { ObjectId } = require("mongodb");
const SachService = require("./sach.service");

class TheodoiMuonTraService {
  constructor(client) {
    this.TheodoiMuonTra = client
      .db("quanlithuvien")
      .collection("theodoimuontra");
    this.SachService = new SachService(client);
  }

  // Phương thức để lọc dữ liệu từ payload
  extractTheodoiMuonTraData(payload) {
    const theodoimuontra = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra || null,
    };

    // Loại bỏ các trường có giá trị là `undefined`
    Object.keys(theodoimuontra).forEach(
      (key) => theodoimuontra[key] === undefined && delete theodoimuontra[key]
    );
    return theodoimuontra;
  }

  // Tạo mượn trả mới
  async create(payload) {
    try {
      const theodoimuontra = this.extractTheodoiMuonTraData(payload);

      // Kiểm tra xem mã độc giả đã mượn mã sách này chưa và chưa trả
      const existingTheodoiMuonTra = await this.TheodoiMuonTra.findOne({
        MaDocGia: theodoimuontra.MaDocGia,
        MaSach: theodoimuontra.MaSach,
        NgayTra: { $exists: false }, // Chỉ kiểm tra các bản ghi chưa trả sách
      });
      if (existingTheodoiMuonTra) {
        throw new Error("Độc giả đang mượn sách này rồi và chưa trả.");
      }

      // Kiểm tra số lượng sách đang mượn
      const sach = await this.SachService.findByMaSach(theodoimuontra.MaSach);
      if (!sach) {
        throw new Error(`Không tìm thấy sách với ID ${theodoimuontra.MaSach}`);
      }
      const borrowedCount = await this.TheodoiMuonTra.countDocuments({
        MaSach: theodoimuontra.MaSach,
        NgayTra: { $exists: false }, // Chỉ kiểm tra các bản ghi chưa trả sách
      });
      if (borrowedCount >= sach.SoQuyen) {
        throw new Error("Đã hết sách này.");
      }

      const result = await this.TheodoiMuonTra.insertOne(theodoimuontra);
      if (!result || !result.insertedId) {
        throw new Error("Failed to create theodoimuontra");
      }
      return { _id: result.insertedId, ...theodoimuontra };
    } catch (error) {
      console.error("Error creating theodoimuontra:", error.message);
      throw new Error(`Không thể tạo mượn trả. Chi tiết: ${error.message}`);
    }
  }

  // Tìm mượn trả theo ID
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const theodoimuontra = await this.TheodoiMuonTra.findOne({
        _id: new ObjectId(id),
      });
      return theodoimuontra || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(
        `Error finding theodoimuontra with ID ${id}:`,
        error.message
      );
      throw new Error(
        `Cannot find theodoimuontra with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm tất cả mượn trả
  async findAll() {
    try {
      const theodoimuontra = await this.TheodoiMuonTra.find().toArray();
      return theodoimuontra;
    } catch (error) {
      console.error("Error finding theodoimuontra:", error.message);
      throw new Error(`Cannot find theodoimuontra. Details: ${error.message}`);
    }
  }

  // Cập nhật mượn trả
  async update(id, payload) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const existingTheodoiMuonTra = await this.TheodoiMuonTra.findOne({
        _id: new ObjectId(id),
      });
      if (!existingTheodoiMuonTra) {
        throw new Error("Không tìm thấy mượn trả với ID này.");
      }
      const theodoimuontra = this.extractTheodoiMuonTraData(payload);
      if (theodoimuontra.NgayTra === null) {
        delete theodoimuontra.NgayTra;
      }
      const result = await this.TheodoiMuonTra.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: theodoimuontra },
        { returnDocument: "after" }
      );
      return result.value;
    } catch (error) {
      console.error(
        `Error updating theodoimuontra with ID ${id}:`,
        error.message
      );
      throw new Error(
        `Cannot update theodoimuontra with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Xóa mượn trả
  async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const result = await this.TheodoiMuonTra.deleteOne({
        _id: new ObjectId(id),
      });
      return result.deletedCount;
    } catch (error) {
      console.error("Error deleting theodoimuontra:", error.message);
      throw new Error(
        `Cannot delete theodoimuontra with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Đếm số lượng mượn trả theo mã sách
  async countByMaSach(maSach) {
    try {
      const count = await this.TheodoiMuonTra.countDocuments({
        MaSach: maSach,
        NgayTra: null, // Chỉ kiểm tra các bản ghi chưa trả sách
      });
      return count;
      console.log(count);
    } catch (error) {
      console.error(
        `Error counting theodoimuontra with MaSach ${maSach}:`,
        error.message
      );
      throw new Error(
        `Cannot count theodoimuontra with MaSach ${maSach}. Details: ${error.message}`
      );
    }
  }
}

module.exports = TheodoiMuonTraService;
