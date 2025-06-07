// utils/test-server.ts
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../graphql/schema";
import { resolvers } from "../graphql/resolvers";
import { AppDataSource } from "../data-source";

/**
 * Initializes a mock ApolloServer connected to a real in-memory DB (or seeded test DB).
 * Used only for unit testing purposes.
 */
export async function createMockServer(): Promise<ApolloServer> {
  // Ensure DB is initialized only once
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  return server;
}
