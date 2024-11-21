const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db("quanlithuvien").collection("docgia");
  }

  // Phương thức để lọc dữ liệu từ payload
  extractDocGiaData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
    };

    // Loại bỏ các trường có giá trị là `undefined`
    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );
    return docgia;
  }

  // Tạo mới đọc giả
  async create(payload) {
    try {
      const docgia = this.extractDocGiaData(payload);
      const existingDocGia = await this.DocGia.findOne({
        MaDocGia: docgia.MaDocGia,
      });
      if (existingDocGia) {
        throw new Error("Mã đọc giả đã tồn tại.");
      }
      const result = await this.DocGia.insertOne(docgia);
      return { _id: result.insertedId, ...docgia }; // Return the correct result
    } catch (error) {
      console.error("Error creating docgia:", error.message);
      throw new Error(`Không thể tạo đọc giả. Chi tiết: ${error.message}`);
    }
  }

  // Tìm đọc giả theo ID
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const docgia = await this.DocGia.findOne({ _id: new ObjectId(id) });
      return docgia || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding docgia with ID ${id}:`, error.message);
      throw new Error(
        `Cannot find docgia with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm tất cả đọc giả
  async findAll() {
    try {
      const docgias = await this.DocGia.find().toArray();
      return docgias;
    } catch (error) {
      console.error("Error finding all docgias:", error.message);
      throw new Error(`Cannot find all docgias. Details: ${error.message}`);
    }
  }

  // Cập nhật đọc giả
  async update(id, payload) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const docgia = this.extractDocGiaData(payload);
      const result = await this.DocGia.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: docgia },
        { returnDocument: "after" }
      );
      return result.value;
    } catch (error) {
      console.error(`Error updating docgia with ID ${id}:`, error.message);
      throw new Error(
        `Cannot update docgia with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Xóa đọc giả
  async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const result = await this.DocGia.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting docgia with ID ${id}:`, error.message);
      throw new Error(
        `Cannot delete docgia with ID ${id}. Details: ${error.message}`
      );
    }
  }
}

module.exports = DocGiaService;
