import { Request, Response } from 'express';
import { sendOrderEventProducer } from '../producers/order.producer';
import inventory from '../data/inventory.json';

export const sendOrderEventController = async (
    request: Request,
    response: Response
) => {
    try {
        const { customerId, productId, quantity } = request.body || {};

        if (request.body && Object.keys(request.body).length > 0) {
            if (!customerId || !productId || typeof quantity !== 'number') {
                response.status(400).json({ message: 'customerId, productId and quantity are required' });
                return;
            }
        }

        // Use provided or generate dummy data
        const product = productId
            ? inventory.find(item => item.productId === productId)
            : inventory[Math.floor(Math.random() * inventory.length)];

        const event = {
            id: "order_" + Math.random().toString(36).substring(2, 10),
            customerId: customerId || "user_" + Math.random().toString(36).substring(2, 10),
            productId: product?.productId,
            quantity: quantity || Math.floor(Math.random() * 5) + 1,
            createdAt: new Date().toISOString()
        };

        await sendOrderEventProducer(event);

        response.status(201).json({ message: 'Order event sent', event });
    } catch (error) {
        console.error('Error sending order event:', error);
        response.status(500).json({ message: 'Failed to send order event' });
    }
};
