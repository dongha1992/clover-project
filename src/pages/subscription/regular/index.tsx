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
    link: '/subscription/regular?tab=spot',
  },
  {
    text: '새벽/택배',
    link: '/subscription/regular?tab=dawn',
  },
];

const RegularPage = () => {
  const router = useRouter();

  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(router.asPath);

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
        {selectedTab === '/subscription/regular?tab=spot' && <SpotTab />}
        {selectedTab === '/subscription/regular?tab=dawn' && <DawnTab />}
      </TabContent>
    </Container>
  );
};

const Container = styled.div``;
const TabContent = styled.div`
  padding: 26px 24px;
`;

export default RegularPage;
