import "@/styles/globals.css";
import "@/styles/Login.css";

import "@/styles/admindashboard.css";
import "@/styles/splash.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
