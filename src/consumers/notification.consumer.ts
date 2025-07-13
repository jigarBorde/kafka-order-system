// src/consumers/notificationEvent.consumer.ts
import { Consumer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { KafkaTopics } from '../constants/kafka.constants';

const consumer: Consumer = kafka.consumer({ groupId: KafkaTopics.NOTIFICATION_EVENTS });

export const notificationEventConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.NOTIFICATION_EVENTS, fromBeginning: true });

    console.log('Notification service started.');

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event: any = JSON.parse(message.value?.toString() || '{}');

            if (event.status === 'completed') {
                console.log(`[Notification] Order ${event.id} for user ${event.customerId} completed successfully.`);
            } else if (event.status === 'failed') {
                console.log(`[Notification] Order ${event.id} for user ${event.customerId} failed. Reason: ${event.reason || 'Unknown'}`);
            } else {
                console.log(`[Notification] Order ${event.id} updated. Current status: ${event.status}`);
            }
        }
    });
};
