import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const PORT = process.env.PORT ?? 4001;

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(PORT) },
});

console.log(`Server ready at ${url}`);
