import multer from 'multer';


const storage = multer.diskStorage({ //diskStorage tells it to temporarily save the file onto your local computer's hard drive (your server's local storage) rather than keeping it floating around in computer memory.
    destination: function (req, file, cb){
        cb(null, './public/temp')  //cb is callback, if cb is null then no errors
    },
    filename: function(req, file, cb){ //It uses file.originalname, which keeps the exact same name the user had on their computer (for example, aadhaar.jpg).
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})

export default upload;