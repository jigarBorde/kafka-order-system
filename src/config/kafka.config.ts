import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'kafka-order-system',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export async function testKafkaConnection() {
    const admin = kafka.admin();
    try {
        await admin.connect();
        console.log('Kafka connection successful');
    } catch (error) {
        console.error('Kafka connection failed:', error);
    } finally {
        await admin.disconnect();
    }
}
