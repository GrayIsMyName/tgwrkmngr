import express from 'express';
import { initDatabase } from './database.js';
import { setupRoutes } from './api.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database
initDatabase();

// Setup API routes
setupRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Bot server running on port ${PORT}`);
});

export default app;

