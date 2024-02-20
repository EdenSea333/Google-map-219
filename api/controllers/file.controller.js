import File from "../models/file.model.js";
import multer from 'multer';


export const test = (req, res) => {
    res.json({
        message: 'api route is working!',
    });
};
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+'_'+file.originalname);
    }
});

export const upload = multer({ storage: storage }).single('file');


export const uploadFile = async (req, res, next) => {
    
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newFile = new File({ filename: file.filename, originalname : file.originalname});
        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });

    } catch (error) {
        next(error);
    }
}

export const readFile = async (req, res, next) => {
    try {
        const files = await File.find({});
        res.status(200).json({files:files});
    } catch (error) {
        next(error);
    }
}

export const deleteFile = async (req, res, next) => {
    try {
      await File.findByIdAndDelete(req.params.id);         
      res.status(200).json("File has been deleted!");
    } catch (error) {
        next(error);
    }
}