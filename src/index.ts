import express from 'express';
import { createServer } from 'http';
import { json } from 'body-parser';
import { startApolloServer } from './api';
import compression from 'compression';
import cors from 'cors';

async function main() {
  const app = express();

  app.use(json());
  app.use(compression());
  app.use(cors());

  await startApolloServer(app); 

  const httpServer = createServer(app);
  const port = process.env.PORT || 4000;

  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error(`Erreur lors du démarrage de l'application:`, error);
});