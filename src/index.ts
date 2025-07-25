import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.routes';
import { testKafkaConnection } from './config/kafka.config';
import { startConsumers } from './constants';

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1', apiRoutes);


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Express TypeScript Server!' });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test Kafka connection
testKafkaConnection()

// Start all the consumers
startConsumers()

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});