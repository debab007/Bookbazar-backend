import express from 'express';
import { placeOrder, getUserOrders,getSellerOrders,updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/order', placeOrder);
router.get('/orders/:userId', getUserOrders);
router.get('/seller/:sellerId', getSellerOrders);
router.put('/status/:orderId', updateOrderStatus);


export default router;
