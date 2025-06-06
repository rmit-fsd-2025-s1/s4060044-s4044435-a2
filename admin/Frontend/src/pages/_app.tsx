import "@/styles/admindashboard.css";
import "@/styles/course-manager.css";
import "@/styles/globals.css";
import "@/styles/lecturer-assignment.css";
import "@/styles/Login.css";
import "@/styles/splash.css";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

import type { AppProps } from "next/app";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
