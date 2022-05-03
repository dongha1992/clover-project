import { StickyTab } from '@components/Shared/TabList';
import { FixedTab } from '@styles/theme';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

const SubsIng = dynamic(() => import('@components/Pages/Mypage/Subscription/Tab/SubsIng'));
const SubsComplete = dynamic(() => import('@components/Pages/Mypage/Subscription/Tab/SubsComplete'));

const SubscriptionManagementPage = () => {
  const router = useRouter();
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(
    `${router.route}?tab=${router.query.tab ? router.query.tab : 'subscribing'}`
  );
  const TabList = [
    {
      text: `구독 중 ()`,
      link: '/mypage/subscription?tab=subscribing',
    },
    {
      text: `구독완료 ()`,
      link: '/mypage/subscription?tab=subscription-complete',
    },
  ];

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },

    [selectedTab]
  );

  return (
    <Container>
      <FixedTab>
        <StickyTab tabList={TabList} isSticky={isSticky} selectedTab={selectedTab} onClick={selectTabHandler} />
      </FixedTab>
      <TabContent>
        {selectedTab === '/mypage/subscription?tab=subscribing' && <SubsIng />}
        {selectedTab === '/mypage/subscription?tab=subscription-complete' && <SubsComplete />}
      </TabContent>
    </Container>
  );
};
const Container = styled.div``;
const TabContent = styled.div`
  padding: 74px 24px 24px;
`;
export default SubscriptionManagementPage;
