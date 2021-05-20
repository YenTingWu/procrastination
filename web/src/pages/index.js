import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-18next.config';
import { useTranslation } from 'next-i18next';
import create from 'zustand';

const containerStyle = {
  width: '50%',
  border: '1px solid black',
  padding: '10px 25px 20px',
  marginTop: '10px',
};

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default function Home() {
  // I18next
  const { t } = useTranslation();

  const router = useRouter();

  const handleRouteLocalePage = (lang) =>
    router.push('/', '/', {
      locale: lang,
    });

  // Zustand

  const bears = useStore((state) => state.bears);

  console.log(bears);
  const increasePopulation = useStore((state) => state.increasePopulation);
  const removeAllBears = useStore((s) => s.removeAllBears);

  // React-query

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={containerStyle}>
        <h1>I18next Test container</h1>
        <p>{t('header.title1')}</p>
        <button onClick={() => handleRouteLocalePage('en')}>switch english</button>
        <button onClick={() => handleRouteLocalePage('zh-TW')}>switch zh-YW</button>
      </div>
      <div style={containerStyle}>
        <h1>Zustand Test Container</h1>
        <p>I have {bears} bears</p>
        <button onClick={increasePopulation}>Add an bears</button>
        <button onClick={removeAllBears}>Remove all bears</button>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
  },
});
