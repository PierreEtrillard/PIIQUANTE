const express = require('express');
const auth = require('../middlewear/auth')
const ctrlSauces = require('../controllers/sauces')
const router = express.Router();

router.post('/',auth, ctrlSauces.createSauce)
router.get('/',ctrlSauces.getAllSauces)
router.get('/:id',ctrlSauces.getSauce)
router.put('/:id',auth, ctrlSauces.ModifySauce)
router.delete('/:id',auth, ctrlSauces.deleteSauce)
router.put('/:id/like',auth, ctrlSauces.likeSauce)

module.exports = router