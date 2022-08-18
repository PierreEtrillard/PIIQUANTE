const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-conf");
const ctrlSauces = require("../controllers/sauces");
const router = express.Router();

router.get("/", auth, ctrlSauces.getAllSauces);
router.get("/:id", auth, ctrlSauces.getSauce);
router.post("/", auth, multer, ctrlSauces.createSauce);
router.put("/:id", auth, multer, ctrlSauces.modifySauce);
router.post("/:id/like", auth, ctrlSauces.likeSauce);
router.delete("/:id", auth, multer, ctrlSauces.deleteSauce);

module.exports = router;