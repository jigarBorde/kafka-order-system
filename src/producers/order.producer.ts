import { Producer } from "kafkajs";
import { kafka } from "../config/kafka.config"
import { KafkaTopics } from "../constants/kafka.constants";


const producer: Producer = kafka.producer();
export const sendOrderEventProducer = async (event: any) => {
    await producer.connect();
    await producer.send({
        topic: KafkaTopics.ORDER_EVENTS,
        messages: [
            {
                key: event.id,
                value: JSON.stringify(event),
            },
        ],
    });
    await producer.disconnect();
    console.log(`Order event sent: ${event.id}`);
}