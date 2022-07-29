import React from 'react';
import styled from 'styled-components';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { getMenusApi, getRecommendMenusApi } from '@api/menu';
import { Item } from '@components/Item';
import { SubsParcelList, SubsSpotList } from '@components/Pages/Subscription';
import { SubsItem } from '@components/Pages/Subscription';

// 기획전 상세 페이지
const PromotionDetailPage = () => {
  const router = useRouter();
  const { subs, id, edit_feed }: any = router.query;

  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getRecommendMenusApi();
      return data.data.sort((a: any, b: any) => a.isSold - b.isSold);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: subsMenus, isLoading: isMenusLoading } = useQuery(
    'getSubscriptionMenus',
    async () => {
      const params = { categories: '', keyword: '', type: 'SUBSCRIPTION' };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const goToSpot = () => {
    // router.push('/subscription/products?tab=spot');
  };

  return (
    <Container>
      {
        edit_feed === 'true' && (
          <EditWrapper></EditWrapper>
        )
      }
      {
        subs === 'true' ? ( // 구독 기획전
          <SubsWrapper>
            {
              subsMenus?.map((item, idx)=> {
                return (
                  <SubsContent key={idx}>
                    <SubsItem item={item} />
                  </SubsContent>
                );
              })
            }
          </SubsWrapper>
        ) : ( // 일반 기획전
          <FlexWrapWrapper padding='0 24px 0 24px'>
            {
              menus?.length! > 0 ? ( 
                menus?.map((item, index) => {
                  return <Item item={item} key={index} />;
                })
              ) : (
                '상품을 준비 중입니다.'
              )
            }
          </FlexWrapWrapper>
        )
      }
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 24px 0;
`;

const SubsWrapper = styled.div`
  ${homePadding};
`;

const SubsContent =styled.div`
  padding: 0 0 24px 0;
`;

const EditWrapper = styled.section`
  width: 100%;
  height: 500px;
  background: ${theme.greyScale25};
  margin: 0 0 24px 0;
`;

export default PromotionDetailPage;