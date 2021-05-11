const multer = require('multer');
const fs  = require('fs')
const path = require('path');

const getFileType=(file)=>{
    const mimeType = file.mimetype.split('/');
    return mimeType[mimeType.length - 1];
}

const generateFileName=(req,file,cb)=>{
    const extension = getFileType(file);
    const fileName= Date.now()+'-'+Math.round(Math.random()*1E9)+'.'+extension;
    cb(null,file.fieldname + '-' + fileName)

};

const fileFilter=(req,file,cb)=>{
    const extension= getFileType(file);
    const allowedTypes = /jpeg|jpg|png/;

    const passed = allowedTypes.test(extension);

    if(passed) return cb(null,true);
    return cb(null,false)
};
exports.userFile=((req,res,next)=>{


    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            const { id } = req.user;
            const dest = `uploads/user/${id}`;

            fs.access(dest,(err)=>{
                if(err){
                    //! it doesn't exist
                    fs.mkdir(dest,(error)=>{
                        cb(error,dest)
                    })
                }else{
                    //! it does exist

                    fs.readdir(dest,(error,files)=>{
                        if (error) throw error;

                        for(const file of files){
                            fs.unlink(path.join(dest,file),error=>{
                                if(error) throw err;
                            });
                        };
                    });
                    return cb(null,dest);

                }
            })

        },
        filename:generateFileName
    });

    return multer({storage , fileFilter }).single('avatar');
    next();
})();

exports.chatFile=((req,res,next)=>{


    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            const { id } = req.body;
            const dest = `uploads/chats/${id}`;
            fs.access(dest, (err) => {
                if (err) {
                    //! it doesn't exist
                    return fs.mkdir(dest, (error) => {
                        cb(error, dest);
                    });
                    
                } else {
                    return cb(null, dest);

                }
            })

        },
        filename:generateFileName
    });

    return multer({storage , fileFilter }).single('image');
    next();
})();