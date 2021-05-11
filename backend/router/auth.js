const router = require('express').Router();
const { login,register } = require('../controllers/authController');
const { body } = require('express-validator');
const { validator } = require('../validators');
const { rules:registerationRules } = require('../validators/auth/register');
const {rules:loginRules} = require('../validators/auth/login');
router.post("/login",[loginRules,validator],login);
router.post("/register",[registerationRules,validator],register);

module.exports = router;