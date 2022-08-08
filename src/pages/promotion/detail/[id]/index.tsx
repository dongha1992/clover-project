import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Item } from '@components/Item';
import { SubsItem } from '@components/Pages/Subscription';
import { getExhibitionInquireApi } from '@api/promotion';
import MarkdownRenderer from '@components/Shared/Markdown';

// 기획전 상세 페이지
const PromotionDetailPage = () => {
  const router = useRouter();
  const [id, setId] = useState<number>();
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    if (router.isReady) {
      setId(Number(router.query?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const {
    data: list,
    error: listError,
    isLoading,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getExhibitionInquireApi(id!);
      setItems(data.data);
      return data.data.menus;
    },
    { 
      refetchOnMount: true, 
      refetchOnWindowFocus: false, 
      enabled: !!id, 
    }
  );

  const goToSpot = () => {
    // router.push('/subscription/products?tab=spot');
  };

  if(isLoading){
    return <div>로딩..</div>;
  };

  return (
    <Container>
      {
        items.content && (
          <MarkDownWrapper>
            <MarkdownRenderer content={items.content!} />
          </MarkDownWrapper>
        )
      }
      {
        items?.type === 'SUBSCRIPTION_MENU' ? ( // 구독 기획전
          <SubsWrapper>
            {
              list?.map((item, idx)=> {
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
              list?.length! > 0 ? ( 
                list?.map((item, index) => {
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

const MarkDownWrapper = styled.div`
  padding-bottom: 24px;
`;


export default PromotionDetailPage;