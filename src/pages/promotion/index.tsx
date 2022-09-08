import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Image from '@components/Shared/Image';
import { TextH6B, TextH3B, TextB3R } from '@components/Shared/Text';
import { theme, homePadding } from '@styles/theme';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';
import { getExhibitionApi } from '@api/promotion';
import { useQuery } from 'react-query';
import { useInfiniteExhibitionList } from '@queries/promotion';
import { Loading } from '@components/Shared/Loading';

const DEFAULT_SIZE = 10;

// 기획전
const PromotionPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    dispatch(INIT_EVENT_TITLE());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, isLoading } =
  useInfiniteExhibitionList({
    size: DEFAULT_SIZE,
    page,
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

    if (ref?.current) {
      observer.observe(ref?.current);
    }
    return () => observer && observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page <= data?.pages[0]?.totalPage!) {
      fetchNextPage();
    }
  }, [page]);

  const goToDetail = (title: string, type: string, id: number) => {
    dispatch(SET_EVENT_TITLE(title ? title : '기획전'));
    router.push(`/promotion/detail/${id}`);
  };

  if (isFetching || isLoading) {
    return <Loading />
  };
  
  return (
    <Container ref={parentRef}>
      <Wrapper>
      {
        data?.pages.map((pages, idx) => {
          return (
            pages.result.length! > 0 ? (
              <ListWrapper key={idx}>
                {
                  pages.result.map((item, idx) => {
                    return (
                      <PromotionWrapper key={idx}>
                        <FlexSpace>
                          <TextH3B padding='24px 0'>{item.title}</TextH3B>
                          <TextH6B 
                            onClick={() => goToDetail(item.title, item.type, item.id)}
                            color={theme.greyScale65} 
                            textDecoration='underline' 
                            pointer
                          >더보기</TextH6B>
                        </FlexSpace>
                        <Image
                          src={item.image.url}
                          height="287px"
                          width="512px"
                          layout="responsive"
                          alt="기획전 목록"
                        />
                      </PromotionWrapper>
                    )
                  })
                }
              </ListWrapper>
            ) : (
              <NonePromotionList key={idx}>
                <TextB3R color={theme.greyScale65}>진행 중인 기획전이 없어요. 😭</TextB3R>
              </NonePromotionList>
            )
          )
        })
      }
      </Wrapper>
      <div className="last" ref={ref}></div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
  .last {
    height: 20px;
  }
`;

const PromotionWrapper = styled.div`
  width: 100%;
  padding-bottom: 9px;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  ${homePadding}
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 100%;
  padding-bottom: 9px;
`;

const NonePromotionList = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default PromotionPage;