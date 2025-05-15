import express from 'express';
const router = express.Router();
import * as cartController from '../controllers/cartController.js';

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.viewCart);
router.delete('/remove', cartController.removeFromCart);

export default router;
