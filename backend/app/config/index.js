const config = {
  app: {
    PORT: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/quanlithuvien",
  },
};

module.exports = config;