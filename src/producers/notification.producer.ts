import { KafkaTopics } from '../constants/kafka.constants';
import { getProducer } from '../lib/kafka.producer';


export const createNotificationProducer = async (event: any) => {
    const producer = await getProducer();
    await producer.send({
        topic: KafkaTopics.NOTIFICATION_EVENTS,
        messages: [
            {
                key: event.id,
                value: JSON.stringify(event),
            },
        ],
    });
};
