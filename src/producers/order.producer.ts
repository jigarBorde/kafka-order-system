import { KafkaTopics } from "../constants/kafka.constants";
import { getProducer } from "../lib/kafka.producer";


export const sendOrderEventProducer = async (event: any) => {
    const producer = await getProducer();
    await producer.send({
        topic: KafkaTopics.ORDER_EVENTS,
        messages: [
            {
                key: event.id,
                value: JSON.stringify(event),
            },
        ],
    });
}