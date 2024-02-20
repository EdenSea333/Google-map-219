import express from 'express';
import { test, uploadFile, readFile, upload, deleteFile } from '../controllers/file.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/upload', verifyToken, upload,  uploadFile);
router.get('/read', verifyToken, readFile);
router.delete('/delete/:id', verifyToken, deleteFile);

export default router;