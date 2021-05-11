const router = require('express').Router();
const { update,search } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validator } = require('../validators');
const { rules:updateRules } = require('../validators/user/update');
const { userFile }= require('../middleware/fileUpload');

router.post('/update',[auth,userFile,updateRules,validator],update);
router.get('/search-users',[auth],search);

module.exports= router;