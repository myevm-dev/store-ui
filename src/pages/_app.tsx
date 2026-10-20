import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "../store";
import Layout from "../components/layout";
import { generalSans } from "../theme";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Head>
                <title>Slick Store | UI Preview</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Slick Store UI with a local sample catalog." />
            </Head>
            <Layout className={generalSans.className}>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}
