import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-18next.config';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp, nextI18NextConfig);
