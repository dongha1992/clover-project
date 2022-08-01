import { getLikeMenus } from '@api/menu';
import { Item } from '@components/Item';
import { SubsItem } from '@components/Pages/Subscription';
import { Button } from '@components/Shared/Button';
import { TextB2R } from '@components/Shared/Text';
import { FlexWrapWrapper } from '@styles/theme';
import router from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const GeneralDibPage = () => {
  const { data: likeMenus, isLoading } = useQuery(
    ['getLikeMenus', 'GENERAL'],
    async () => {
      const { data } = await getLikeMenus('GENERAL');

      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const goToHome = () => {
    router.push('/');
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <MypageLikeMenusContainer>
      {likeMenus.length !== 0 ? (
        <FlexWrapWrapper>
          {likeMenus?.map((item: any, index: number) => {
            return <Item item={item} key={index} />;
          })}
        </FlexWrapWrapper>
      ) : (
        <div className="buttonBox">
          <TextB2R padding="0 0 24px">찜한 상품이 없어요 😭</TextB2R>
          <Button backgroundColor="#fff" color="#242424" width="100%" border onClick={goToHome}>
            상품 보러가기
          </Button>
        </div>
      )}
    </MypageLikeMenusContainer>
  );
};

export const MypageLikeMenusContainer = styled.div`
  padding: 74px 24px 26px;
  min-height: calc(100vh - 112px);
  position: relative;
  .buttonBox {
    width: calc(100% - 48px);
    position: absolute;
    top: 50%;
    left: 24px;
    transform: translateY(-50%);
    text-align: center;
  }
`;

export default GeneralDibPage;
