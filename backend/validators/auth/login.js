const { body } = require('express-validator');


exports.rules=(()=>{
    return [
        body('email').isEmail(),
        body('password').isLength({ min:5 })
    ];
})();