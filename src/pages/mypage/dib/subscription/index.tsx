import { getLikeMenus } from '@api/menu';
import { SubsItem } from '@components/Pages/Subscription';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const SubscriptionDibPage = () => {
  const { data: likeMenus, isLoading } = useQuery(
    ['getLikeMenus', 'SUBSCRIPTION'],
    async () => {
      const { data } = await getLikeMenus('SUBSCRIPTION');

      return data.data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  if (isLoading) return <div>...로딩중</div>;
  return (
    <Container>
      {likeMenus.map((item: any, index: number) => (
        <SubsItem item={item} key={index} />
      ))}
    </Container>
  );
};
const Container = styled.div`
  padding: 74px 24px 26px;
`;

export default SubscriptionDibPage;
