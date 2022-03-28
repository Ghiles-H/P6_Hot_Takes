const express = require("express");
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const token = require('../middelware/token');
const multer = require('../middelware/multerConfig')

//Router GET
router.get("/", token.authToken, saucesCtrl.getAllSauces);
router.get("/:id", token.authToken, saucesCtrl.getSingleSauce);

//Router POST
router.post("/", token.authToken, multer, saucesCtrl.createNewSauce);
router.post("/:id/like", token.authToken, saucesCtrl.likeDislikeSauce);

//Router DELETE
router.delete("/:id", token.authToken, saucesCtrl.deleteSauce);

//Router PUT
router.put("/:id", token.authToken, multer, saucesCtrl.updateSauce);


module.exports = router;