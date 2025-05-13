import express from 'express';
import { fetchBooks, fetchBook, myBooks } from '../controllers/bookController.js';
import upload from '../utils/fileUpload.js';
import { uploadBookImage } from '../controllers/bookController.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadBookImage);
router.get('/searchbooks', fetchBooks);
router.get('/searchbook', fetchBook);
router.get('/uploadedbooks', myBooks);

export default router;



