import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import express from 'express';
import { typeDefs } from './schema/schema.js';
import { resolvers } from './resolvers.js';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server) as unknown as express.RequestHandler,
);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql`);
});
