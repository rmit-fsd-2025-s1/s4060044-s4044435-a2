import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql", // 👈 make sure this matches your backend
  cache: new InMemoryCache(),
});

export default client;
