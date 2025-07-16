# 🚀 Kafka Order Processing System

A comprehensive microservices-based order processing system built with **Kafka**, **TypeScript**, and **Node.js**. This project demonstrates real-world event-driven architecture patterns used in production systems.

## 🎯 Overview

This system simulates a real-world e-commerce order processing pipeline where:
- Orders are created via REST API
- Events flow through Kafka topics
- Multiple microservices process orders asynchronously
- Each service has a specific responsibility (payment, inventory, notifications)

**Perfect for learning:**
- Event-driven architecture
- Kafka producer/consumer patterns
- Microservices communication
- Async message processing
- Consumer groups and partitioning

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐
│   Client    │───▶│  Order API  │───▶│   order-events      │
│ (Postman)   │    │  Service    │    │     (Kafka)         │
└─────────────┘    └─────────────┘    └─────────────────────┘
                                                │
                   ┌────────────────────────────┼────────────────────────────┐
                   ▼                            ▼                            ▼
         ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
         │ Payment Service │          │Inventory Service│          │Notification Svc │
         │  (Consumer)     │          │  (Consumer)     │          │  (Consumer)     │
         └─────────────────┘          └─────────────────┘          └─────────────────┘
                   │                            │                            │
                   ▼                            ▼                            ▼
         ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
         │ payment-events  │          │inventory-events │          │notification-evts│
         │    (Kafka)      │          │    (Kafka)      │          │    (Kafka)      │
         └─────────────────┘          └─────────────────┘          └─────────────────┘
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Message Queue:** Apache Kafka
- **Containerization:** Docker
- **Data Storage:** JSON files (for learning purposes)
- **Development:** nodemon, ts-node

## ⚡ Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Postman** or curl for API testing
- Basic knowledge of JavaScript/TypeScript
- Understanding of REST APIs

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/jigarBorde/kafka-order-system.git
cd kafka-order-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Kafka with Docker
```bash
docker-compose up -d
```

### 4. Create Kafka Topics
```bash
# Create the main topics
docker exec -it kafka-container kafka-topics.sh --create \
  --topic order-events \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec -it kafka-container kafka-topics.sh --create \
  --topic payment-events \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec -it kafka-container kafka-topics.sh --create \
  --topic inventory-events \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec -it kafka-container kafka-topics.sh --create \
  --topic notification-events \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092
```

### 5. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Documentation

### Create Order
```http
POST /api/v1/orders
Content-Type: application/json

{
  "customerId": "customer-123",
  "productId": "product-A",
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "Order event sent",
  "event": {
    "id": "order_abc123",
    "customerId": "customer-123",
    "productId": "product-A",
    "quantity": 2,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 📨 Kafka Topics & Events

### Topics Overview
| Topic | Purpose | Partitions | Consumers |
|-------|---------|------------|-----------|
| `order-events` | New order creation | 3 | Order Consumer |
| `payment-events` | Payment processing | 3 | Payment Consumer |
| `inventory-events` | Stock management | 3 | Inventory Consumer |
| `notification-events` | User notifications | 3 | Notification Consumer |

### Event Flow
1. **Order Created** → `order-events` topic
2. **Payment Processed** → `payment-events` topic  
3. **Inventory Updated** → `inventory-events` topic
4. **Notification Sent** → `notification-events` topic

### Sample Event Structure
```json
{
  "id": "order_abc123",
  "customerId": "customer-123",
  "productId": "product-A",
  "quantity": 2,
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Service Details

### Order Service
- **File:** `src/consumers/order.consumer.ts`
- **Responsibility:** Process incoming orders, save to storage
- **Consumer Group:** `order-events`
- **Triggers:** Payment processing

### Payment Service
- **File:** `src/consumers/payment.consumer.ts`
- **Responsibility:** Process payments, update order status
- **Consumer Group:** `payment-events`
- **Triggers:** Inventory check

### Inventory Service
- **File:** `src/consumers/inventory.consumer.ts`
- **Responsibility:** Check stock, reserve items
- **Consumer Group:** `inventory-events`
- **Triggers:** Notification service

### Notification Service
- **File:** `src/consumers/notification.consumer.ts`
- **Responsibility:** Send order confirmations
- **Consumer Group:** `notification-events`
- **Triggers:** Email/SMS notifications (simulated)

### Monitor Consumer Groups
```bash
# Check consumer group status
docker exec -it kafka-container kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group order-events

# Check consumer lag
docker exec -it kafka-container kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group payment-events
```

### Kafka Concepts Demonstrated
- ✅ **Producers and Consumers**
- ✅ **Consumer Groups**
- ✅ **Partitioning Strategy**
- ✅ **Event-Driven Architecture**
- ✅ **Microservices Communication**
- ✅ **Async Message Processing**



### Development Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests (when added)
npm test
```


## 🙏 Acknowledgments

- Built for learning Kafka and event-driven architecture
- Inspired by real-world microservices patterns
---

**Happy Learning!** 🚀 If you found this helpful, please ⭐ star the repository and share it with other developers learning Kafka!