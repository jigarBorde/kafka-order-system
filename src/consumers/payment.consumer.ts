import fs from 'fs/promises';
import path from 'path';
import { Consumer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { KafkaTopics } from '../constants/kafka.constants';
import { createNotificationProducer } from '../producers/notification.producer';
import { inventoryUpdateProducer } from '../producers/inventory.producer';

const consumer: Consumer = kafka.consumer({ groupId: KafkaTopics.PAYMENT_EVENTS });
const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

export const paymentEventConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.PAYMENT_EVENTS, fromBeginning: true });
    console.log(`Consumer connected to group: ${KafkaTopics.PAYMENT_EVENTS}`);

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const event: any = JSON.parse(message.value?.toString() || '{}');
                console.log('Processing payment for order:', event.id);

                // Simulate payment logic (could add delay or random success/failure here)
                const ordersRaw = await fs.readFile(ORDERS_FILE, 'utf-8');
                const orders = JSON.parse(ordersRaw || '[]');

                const orderIndex = orders.findIndex((o: any) => o.id === event.id);

                if (orderIndex === -1) {
                    console.warn(`Order ${event.id} not found in orders.json`);
                    return;
                }

                // Update status to completed
                orders[orderIndex].status = 'completed';

                await createNotificationProducer({
                    id: event.id,
                    customerId: event.customerId,
                    status: 'completed'
                });

                await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
                await inventoryUpdateProducer(event); // inventory service of order completion

                console.log(`Payment processed. Order ${event.id} marked as completed.`);
            } catch (error) {
                console.error('Error processing payment event:', error);
            }
        }
    });
};
