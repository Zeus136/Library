const express = require("express");
const router = express.Router();
const nxbController = require("../controllers/nxb.controller");

// Định nghĩa các route cho nhà xuất bản
router.get("/", nxbController.findAll);
router.post("/", nxbController.create);
router.get("/:id", nxbController.findOne);
router.put("/:id", nxbController.update);
router.delete("/:id", nxbController.delete);

module.exports = router;
