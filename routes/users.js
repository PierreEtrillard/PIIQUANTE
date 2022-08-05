const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/users')

router.post('/signup', ctrlUser.createUser)
router.post('/login', ctrlUser.login)

module.exports = router