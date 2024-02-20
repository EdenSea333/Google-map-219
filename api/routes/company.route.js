import express from 'express';
import { addCompany, readCompanyList } from '../controllers/company.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add/:id', verifyToken, addCompany);
router.get('/read', verifyToken, readCompanyList);

export default router;