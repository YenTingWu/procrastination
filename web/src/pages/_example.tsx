import React from 'react';

interface Props {}
export const Example: React.FC<Props> = () => {
  // // I18next
  // const { t } = useTranslation();

  // const router = useRouter();

  // const handleRouteLocalePage = (lang) =>
  //   router.push('/', '/', {
  //     locale: lang,
  //   });

  //   // Zustand
  //   const useStore = create((set) => ({
  //     bears: 0,
  //     increasePopulation: () =>
  //       set((state: { bears: number }) => ({ bears: state.bears + 1 })),
  //     removeAllBears: () => set({ bears: 0 }),
  //   }));

  //   const bears = useStore((state) => state.bears);

  //   console.log(bears);
  //   const increasePopulation = useStore((state) => state.increasePopulation);
  //   const removeAllBears = useStore((s) => s.removeAllBears);

  return <div>Example</div>;
};
