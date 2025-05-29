import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@apollo/server/express4";

// Create an instance of the Express application
const app:any = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 3001;

// Apply CORS and JSON body parsing middleware
app.use(cors());
app.use(express.json());

// Function to start the Apollo Server and connect it to the Express app
async function startServer() {
  // Initialize Apollo Server with schema definitions and resolvers
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the Apollo Server
  await apolloServer.start();

  // Apply Apollo Server middleware to the /graphql endpoint
  app.use("/graphql", expressMiddleware(apolloServer, {}));

  // Initialize TypeORM data source
  await AppDataSource.initialize();
  console.log("Data Source has been initialized.");

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
}

// Start the server and catch any errors during initialization
startServer().catch((error) =>
  console.error("Error during server initialization:", error)
);
