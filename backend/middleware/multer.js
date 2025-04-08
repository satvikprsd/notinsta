import multer from "multer";

const upload =  multer({ 
    storage: multer.memoryStorage(),
    dest: 'uploads/' 
});

export default upload;