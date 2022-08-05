const express = require('express');
const router = express.Router();
const ctrlSauces = require('../controllers/sauces')

router.post('/',ctrlSauces.createSauce)
router.get('/',ctrlSauces.getAllSauces)
router.get('/:id',ctrlSauces.getSauce)
router.put('/:id',ctrlSauces.ModifySauce)
router.delete('/:id',ctrlSauces.deleteSauce)
router.put('/:id/like',ctrlSauces.likeSauce)

module.exports = router