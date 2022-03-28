const express = require("express");
const router =  express.Router();

const authCtrl = require("../controllers/auth");
const token = require('../middelware/token');

router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.login);
//router.get("/", authCtrl.getAllUsers);
//router.get("/me", token.authToken);
//router.post("/refreshToken", authCtrl.refreshToken);

module.exports = router;