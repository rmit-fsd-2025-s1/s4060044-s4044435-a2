import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({// Create a new Apollo Client instance

  uri: "http://localhost:3001/graphql",  // The URL where your GraphQL server is running

  cache: new InMemoryCache(),
});

export default client;
