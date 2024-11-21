const express = require("express");
const router = express.Router();
const theodoimuontraController = require("../controllers/theodoimuontra.controller");

// Định nghĩa các route cho theo dõi mượn trả
router.get("/", theodoimuontraController.findAll);
router.post("/", theodoimuontraController.create);
router.get("/:id", theodoimuontraController.findOne);
router.put("/:id", theodoimuontraController.update);
router.delete("/:id", theodoimuontraController.delete);

module.exports = router;
