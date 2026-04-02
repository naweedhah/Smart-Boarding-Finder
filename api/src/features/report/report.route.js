const router = require("express").Router();
const { createReport } = require("./report.controller");

router.post("/", createReport);

module.exports = router;