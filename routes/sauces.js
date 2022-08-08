const express = require('express');
const auth = require('../middlewear/auth');
const multer = require('multer');
const ctrlSauces = require('../controllers/sauces');
const router = express.Router();

router.post('/', auth, multer, ctrlSauces.createSauce)
router.get('/',ctrlSauces.getAllSauces)
router.get('/:id',ctrlSauces.getSauce)
router.put('/:id/like', auth, ctrlSauces.likeSauce)
router.put('/:id',auth, multer, ctrlSauces.ModifySauce)
router.delete('/:id',auth, ctrlSauces.deleteSauce)

module.exports = router