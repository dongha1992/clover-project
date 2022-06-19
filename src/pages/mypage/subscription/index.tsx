import { getOrdersApi } from '@api/order';
import { StickyTab } from '@components/Shared/TabList';
import { FixedTab } from '@styles/theme';
import { cloneDeep } from 'lodash-es';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const SubsIng = dynamic(() => import('@components/Pages/Mypage/Subscription/Tab/SubsIng'));
const SubsComplete = dynamic(() => import('@components/Pages/Mypage/Subscription/Tab/SubsComplete'));

const SubscriptionManagementPage = () => {
  const router = useRouter();
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(
    `${router.route}?tab=${router.query.tab ? router.query.tab : 'subscribing'}`
  );
  const [subscribingLength, setSubscribingLength] = useState(0);
  const [subsCompleteLength, setSubsCompleteLength] = useState(0);

  const {
    data: subsList,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getSubscriptionOrders', 'both'],
    async () => {
      const params = { days: 90, page: 1, size: 100, type: 'SUBSCRIPTION' };
      const { data } = await getOrdersApi(params);

      return data.data.orders;
    },
    {
      onSuccess: (data) => {
        const ing = cloneDeep(data).filter((item: any) => item.status !== 'COMPLETED' || item.status !== 'CANCELED');
        const complete = cloneDeep(data).filter(
          (item: any) => item.status === 'COMPLETED' || item.status === 'CANCELED'
        );

        setSubscribingLength(ing.length);
        setSubsCompleteLength(complete.length);
      },
      onError: () => {
        router.replace('/onboarding');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      retry: false,
    }
  );

  const TabList = [
    {
      text: `구독 중 (${subscribingLength})`,
      link: '/mypage/subscription?tab=subscribing',
    },
    {
      text: `구독완료 (${subsCompleteLength})`,
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
