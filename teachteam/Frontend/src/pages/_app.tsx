import "@/styles/globals.css";
import "../styles/cards.css";
import "../styles/home.css";
import "../styles/login.css";
import "../styles/navbar.css";
import "../styles/signup.css";
import "../styles/splash.css";
import "../styles/lecturer.css";
import "../styles/Piechart.css";
import "../styles/profile.css";

import type { AppProps } from "next/app";
import "../styles/tutorPage.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
