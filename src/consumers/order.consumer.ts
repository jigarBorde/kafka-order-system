import fs from 'fs/promises';
import path from 'path';
import { Consumer } from "kafkajs";
import { kafka } from "../config/kafka.config";
import { KafkaTopics } from "../constants/kafka.constants";
import { createPaymentEventProducer } from "../producers/payment.producer";

const consumer: Consumer = kafka.consumer({ groupId: KafkaTopics.ORDER_EVENTS });

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

export const orderEventConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.ORDER_EVENTS, fromBeginning: true });
    console.log(`Consumer connected to group: ${KafkaTopics.ORDER_EVENTS}`);

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const event: any = JSON.parse(message.value?.toString() || '{}');
                console.log('Received order event:', event);

                const existingOrdersRaw = await fs.readFile(ORDERS_FILE, 'utf-8');
                const orders = JSON.parse(existingOrdersRaw);

                const newOrder = {
                    ...event,
                    status: "pending"
                };
                orders.push(newOrder);

                await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
                console.log('Order saved to orders.json');

                // Send to payment producer
                await createPaymentEventProducer(newOrder);
            } catch (err) {
                console.error('Error processing order event:', err);
            }
        },
    });
};
