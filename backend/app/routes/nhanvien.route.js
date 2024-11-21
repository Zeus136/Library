const express = require("express");
const router = express.Router();
const nhanvienController = require("../controllers/nhanvien.controller");

router.get("/", nhanvienController.findAll);
router.post("/", nhanvienController.create);
router.get("/:id", nhanvienController.findOne);
router.put("/:id", nhanvienController.update);
router.delete("/:id", nhanvienController.delete);
router.post("/login", nhanvienController.login);
router.get("/msnv/:msnv", nhanvienController.findByMSNV);
router.put("/msnv/:msnv", nhanvienController.updateByMSNV);
router.put("/:id/password", nhanvienController.updatePasswordById);
router.put("/msnv/:msnv/password", nhanvienController.updatePasswordByMSNV);

module.exports = router;
