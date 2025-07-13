import fs from 'fs/promises';
import path from 'path';
import { Consumer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { KafkaTopics } from '../constants/kafka.constants';
import { createNotificationProducer } from '../producers/notification.producer';

const consumer: Consumer = kafka.consumer({ groupId: KafkaTopics.INVENTORY_EVENTS });

const INVENTORY_FILE = path.join(__dirname, '..', 'data', 'inventory.json');

export const inventoryEventConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.INVENTORY_EVENTS, fromBeginning: true });
    console.log(`Consumer connected to group: ${KafkaTopics.INVENTORY_EVENTS}`);

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const event: any = JSON.parse(message.value?.toString() || '{}');
                console.log(`Processing inventory update for order: ${event.id}`);

                const inventoryRaw = await fs.readFile(INVENTORY_FILE, 'utf-8');
                const inventory = JSON.parse(inventoryRaw || '[]');

                const item = inventory.find((i: any) => i.productId === event.productId);
                if (!item) {
                    console.warn(`Product ${event.productId} not found in inventory.`);
                    return;
                }

                if (item.quantity < event.quantity) {
                    console.warn(`Insufficient stock for product ${event.productId}`);
                    await createNotificationProducer({
                        id: event.id,
                        customerId: event.customerId,
                        status: 'failed',
                        reason: 'Insufficient stock'
                    });
                    // TODO: Handle insufficient stock case (e.g., notify, log, etc.)
                    // Refund flow
                    return;
                }

                item.quantity -= event.quantity;

                await fs.writeFile(INVENTORY_FILE, JSON.stringify(inventory, null, 2), 'utf-8');
                console.log(`Inventory updated: ${item.productId} - Remaining: ${item.quantity}`);
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }
    });
};
