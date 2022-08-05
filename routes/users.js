const express = require('express');
const ctrlUser = require('../controllers/users')
const auth = require('../middlewear/auth')
const router = express.Router();

router.post('/signup', ctrlUser.createUser)
router.post('/login', ctrlUser.login)

module.exports = router