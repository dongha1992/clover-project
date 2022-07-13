import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useGetOrders, useInfiniteOrders } from '@queries/order';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { TextB2R, TextB3R } from '@components/Shared/Text';
import { FlexCol, theme } from '@styles/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubsMngItem } from '@components/Pages/Mypage/Subscription';
import { Button } from '@components/Shared/Button';

const SubscriptionManagementPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const parentRef = useRef<any>();
  const childRef = useRef<any>();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteOrders({
    days: 365,
    size: 10,
    type: 'SUBSCRIPTION',
  });

  const option = {
    root: parentRef?.current!, // 관찰대상의 부모요소를 지정
    rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0,
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, option);

    if (childRef?.current) {
      observer.observe(childRef?.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page <= data?.pages[0].totalPage!) {
      fetchNextPage();
    }
  }, [page]);

  const goToSubscription = () => {
    router.push('/subscription');
  };

  return (
    <Container ref={parentRef}>
      {data?.pages[0]?.result.length !== 0 ? (
        <>
          {data?.pages?.map((page: any, index) => (
            <SubsMngList key={index}>
              {page.result?.map((item: IGetOrders, index: number) => (
                <SubsMngItem item={item} key={index} />
              ))}
            </SubsMngList>
          ))}
          {isFetching && <div>... 로딩중</div>}
          <InfoBox>
            <TextB3R color={theme.greyScale65}>
              최근 1년 이내 구독 내역만 조회 가능해요. (이전 구독 내역은 고객센터로 문의해 주세요.)
            </TextB3R>
          </InfoBox>
        </>
      ) : (
        <NoSubsBox>
          <FlexCol width="100%">
            <TextB2R padding="0 0 24px" color={theme.greyScale65} center>
              구독중인 상품이 없어요 😭
            </TextB2R>
            <Button backgroundColor="#fff" color="#242424" width="100%" border onClick={goToSubscription}>
              구독 상품 보러가기
            </Button>
          </FlexCol>
        </NoSubsBox>
      )}
      <div ref={childRef}></div>
    </Container>
  );
};
const Container = styled.div``;
const SubsMngList = styled.div`
  padding: 24px;
`;
const InfoBox = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
`;
const NoSubsBox = styled.div`
  height: calc(100vh - 104px);
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

export default SubscriptionManagementPage;
