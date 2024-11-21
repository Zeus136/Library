const { ObjectId } = require("mongodb");

class NXBService {
  constructor(client) {
    this.NXB = client.db("quanlithuvien").collection("nxb");
  }

  // Phương thức để lọc dữ liệu từ payload
  extractNXBData(payload) {
    const nxb = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };

    // Loại bỏ các trường có giá trị là `undefined`
    Object.keys(nxb).forEach(
      (key) => nxb[key] === undefined && delete nxb[key]
    );
    return nxb;
  }

  // Tạo hoặc cập nhật nhà xuất bản mới
  async create(payload) {
    try {
      const nxb = this.extractNXBData(payload);
      const existingNXB = await this.NXB.findOne({ MaNXB: nxb.MaNXB });
      if (existingNXB) {
        throw new Error("Mã nhà xuất bản đã tồn tại.");
      }
      const result = await this.NXB.insertOne(nxb);
      if (!result || !result.insertedId) {
        throw new Error("Failed to create nxb");
      }
      return { _id: result.insertedId, ...nxb };
    } catch (error) {
      console.error("Error creating nxb:", error.message);
      throw new Error(`Không thể tạo nhà xuất bản. Chi tiết: ${error.message}`);
    }
  }

  // Tìm nhà xuất bản theo ID
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const nxb = await this.NXB.findOne({ _id: new ObjectId(id) });
      return nxb || null; // Trả về null nếu không tìm thấy
    } catch (error) {
      console.error(`Error finding nxb with ID ${id}:`, error.message);
      throw new Error(
        `Cannot find nxb with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Tìm tất cả nhà xuất bản
  async findAll() {
    try {
      const nxb = await this.NXB.find().toArray();
      return nxb;
    } catch (error) {
      console.error("Error finding nxb:", error.message);
      throw new Error(`Cannot find nxb. Details: ${error.message}`);
    }
  }

  // Cập nhật nhà xuất bản
  async update(id, payload) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const existingNXB = await this.NXB.findOne({ _id: new ObjectId(id) });
      if (!existingNXB) {
        throw new Error("Không tìm thấy nhà xuất bản với ID này.");
      }
      const nxb = this.extractNXBData(payload);
      if (JSON.stringify(existingNXB) === JSON.stringify(nxb)) {
        throw new Error("Không có thông tin nào được cập nhật.");
      }
      if (nxb.MaNXB !== existingNXB.MaNXB) {
        const nxbWithSameMaNXB = await this.NXB.findOne({
          MaNXB: nxb.MaNXB,
        });
        if (nxbWithSameMaNXB) {
          throw new Error("Mã nhà xuất bản không được trùng.");
        }
      }
      const result = await this.NXB.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: nxb },
        { returnDocument: "after" }
      );
      return result.value;
    } catch (error) {
      console.error(`Error updating nxb with ID ${id}:`, error.message);
      throw new Error(
        `Cannot update nxb with ID ${id}. Details: ${error.message}`
      );
    }
  }

  // Xóa nhà xuất bản
  async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const result = await this.NXB.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting nxb with ID ${id}:`, error.message);
      throw new Error(
        `Cannot delete nxb with ID ${id}. Details: ${error.message}`
      );
    }
  }
}

module.exports = NXBService;
