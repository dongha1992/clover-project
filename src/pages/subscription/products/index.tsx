import { StickyTab } from '@components/Shared/TabList';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const SpotTab = dynamic(() => import('@components/Pages/Subscription/Tab/SpotTab'));
const DawnTab = dynamic(() => import('@components/Pages/Subscription/Tab/DawnTab'));

const MENU = [
  {
    text: '프코스팟',
    link: '/subscription/products?tab=spot',
  },
  {
    text: '새벽/택배',
    link: '/subscription/products?tab=dawn',
  },
];

const SubsProductPage = () => {
  const router = useRouter();

  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(`${router.route}?tab=${router.query.tab ? router.query.tab : 'spot'}`);

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },
    [selectedTab]
  );

  return (
    <Container>
      <StickyTab tabList={MENU} isSticky={isSticky} selectedTab={selectedTab} onClick={selectTabHandler} />
      <TabContent>
        {selectedTab === '/subscription/products?tab=spot' && <SpotTab />}
        {selectedTab === '/subscription/products?tab=dawn' && <DawnTab />}
      </TabContent>
    </Container>
  );
};

const Container = styled.div``;
const TabContent = styled.div`
  padding: 26px 24px;
`;

export default SubsProductPage;
