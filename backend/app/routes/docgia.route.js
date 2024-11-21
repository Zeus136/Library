const express = require("express");
const router = express.Router();
const docgiaController = require("../controllers/docgia.controller");

// Định nghĩa các route cho độc giả
router.get("/", docgiaController.findAll);
router.post("/", docgiaController.create);
router.get("/:id", docgiaController.findOne);
router.put("/:id", docgiaController.update);
router.delete("/:id", docgiaController.delete);

module.exports = router;
