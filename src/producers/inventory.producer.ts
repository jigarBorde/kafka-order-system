import { getProducer } from "../lib/kafka.producer";
import { KafkaTopics } from "../constants/kafka.constants";


export const inventoryUpdateProducer = async (event: any) => {
    const producer = await getProducer();
    await producer.send({
        topic: KafkaTopics.INVENTORY_EVENTS,
        messages: [
            {
                key: event.id,
                value: JSON.stringify(event),
            },
        ],
    });
    };
