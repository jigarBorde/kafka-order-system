import { Producer } from 'kafkajs';
import { kafka } from '../config/kafka.config';

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
    if (producer) return producer;
    producer = kafka.producer();
    await producer.connect();
    return producer;
}


export async function disconnectProducer(): Promise<void> {
    if (!producer) return;
    try {
        await producer.disconnect();
    } finally {
        producer = null;
    }
}
