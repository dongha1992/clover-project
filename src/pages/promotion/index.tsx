import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { TextH6B, TextH3B } from '@components/Shared/Text';
import { theme, homePadding } from '@styles/theme';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';
import { getExhibitionApi } from '@api/promotion';
import { useQuery } from 'react-query';
import { useInfiniteExhibitionList } from '@queries/promotion';

const DEFAULT_SIZE = 10;

const CONTENTS = [
  {
    id: 1, 
    title: '메인 콘텐츠 일반기획전!!', 
    img: '/banner/img_home_contents_event.png', 
    subs: false,
    edit: true,
  },
  {
    id: 2, 
    title: '메인 콘텐트 구독기획전!!', 
    img: '/banner/img_home_contents_event_2.png', 
    subs: true,
    edit: false,
  },
];

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

  return (
    <Container ref={parentRef}>
      <Wrapper>
      {
        data?.pages.map((pages, idx) => {
          return (
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
                      height="300px"
                      width="512px"
                      layout="responsive"
                      alt="기획전 목록"
                    />
                  </PromotionWrapper>
                  )
                })
              }
            </ListWrapper>
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


export default PromotionPage;