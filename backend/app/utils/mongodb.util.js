const { MongoClient } = require("mongodb");

class MongoDB {
  static client;

  // Phương thức kết nối tới MongoDB
  static async connect(uri) {
    if (!this.client) {
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await this.client.connect();
      console.log("Connected to MongoDB");
    }
    return this.client;
  }
}

module.exports = MongoDB;
