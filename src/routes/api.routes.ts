import { Router, Request, Response } from 'express';
import { sendOrderEventController } from '../controllers/order.controller';

const router = Router();

router.post('/order', sendOrderEventController);

export default router;