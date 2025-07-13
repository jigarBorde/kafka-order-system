import { inventoryEventConsumer } from "../consumers/inventory.consumer";
import { notificationEventConsumer } from "../consumers/notification.consumer";
import { orderEventConsumer } from "../consumers/order.consumer";
import { paymentEventConsumer } from "../consumers/payment.consumer";

export const startConsumers = async () => {
    await Promise.all([
        orderEventConsumer(), // order event consumer
        paymentEventConsumer(), // payment event consumer
        inventoryEventConsumer(), // inventory event consumer
        notificationEventConsumer() // notification event consumer
    ]);
};