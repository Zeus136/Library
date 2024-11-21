const express = require("express");
const sachs = require("../controllers/sach.controller.js");

const router = express.Router();

router.route("/").get(sachs.findAll).post(sachs.create);
router.route("/:id").get(sachs.findOne).put(sachs.update).delete(sachs.delete);

module.exports = router;
