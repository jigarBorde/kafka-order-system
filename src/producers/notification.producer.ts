import { Producer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { KafkaTopics } from '../constants/kafka.constants';

const producer: Producer = kafka.producer();

export const createNotificationProducer = async (event: any) => {
    await producer.connect();
    await producer.send({
        topic: KafkaTopics.NOTIFICATION_EVENTS,
        messages: [
            {
                key: event.id,
                value: JSON.stringify(event),
            },
        ],
    });
    await producer.disconnect();
    console.log(`Notification event produced for order: ${event.id}`);
};
