const router = require('express').Router();

router.get("/",(req,res,next)=>{
    return res.send("Welcome to Home Page")
});
router.use('/',require('./auth'));
router.use('/users',require('./user'));
router.use('/chats',require('./chat'));

module.exports = router;