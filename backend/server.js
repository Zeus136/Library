const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");
const app = require("./app");

async function startServer() {
  try {
    // Kết nối tới MongoDB
    await MongoDB.connect(config.db.uri);
    console.log("MongoDB connected successfully.");

    // Khởi động server sau khi kết nối MongoDB thành công
    app.listen(config.app.PORT, () => {
      console.log(`Server is running on http://localhost:${config.app.PORT}`);
    });
  } catch (error) {
    console.error("Cannot connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
