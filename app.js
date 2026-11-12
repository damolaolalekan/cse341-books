
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import { getDb } from './src/db/connect.js';
import router from './src/router.js';

const app = express();

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Homepage
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

// Practice trails endpoint
app.get('/trails', async (req, res) => {
  try {
    const trails = await getDb()
      .collection('trails')
      .find({})
      .toArray();

    return res.status(200).json(trails);
  } catch (error) {
    console.error('Failed to retrieve trails:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve trails'      
    });
  }
});

// Register Books API routes
app.use('/', router);

export default app;
