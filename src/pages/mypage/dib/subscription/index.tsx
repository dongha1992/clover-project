import { getLikeMenus } from '@api/menu';
import { SubsItem } from '@components/Pages/Subscription';
import { Button } from '@components/Shared/Button';
import { TextB2R } from '@components/Shared/Text';
import router from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { MypageLikeMenusContainer } from '../general';

const SubscriptionDibPage = () => {
  const { data: likeMenus, isLoading } = useQuery(
    ['getLikeMenus', 'SUBSCRIPTION'],
    async () => {
      const { data } = await getLikeMenus('SUBSCRIPTION');

      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const goToSubscription = () => {
    router.push('/subscription');
  };

  if (isLoading) return <div>...로딩중</div>;
  return (
    <MypageLikeMenusContainer>
      {likeMenus.length !== 0 ? (
        likeMenus.map((item: any, index: number) => <SubsItem item={item} key={index} />)
      ) : (
        <div className="buttonBox">
          <TextB2R padding="0 0 24px">찜한 구독 상품이 없어요 😭</TextB2R>
          <Button backgroundColor="#fff" color="#242424" width="100%" border onClick={goToSubscription}>
            구독 상품 보러가기
          </Button>
        </div>
      )}
    </MypageLikeMenusContainer>
  );
};

export default SubscriptionDibPage;
