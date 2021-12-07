import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import useFetch from '@hooks/useFetch';
import router from 'next/router';

function review() {
  const [page, setPage] = useState<number>(0);
  const { loading, error, list } = useFetch(page);
  const ref = useRef<HTMLImageElement>(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null, // 관찰대상의 부모요소를 지정
      rootMargin: '20px', // 관찰하는 뷰포트의 마진 지정
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (ref.current) {
      observer.observe(ref?.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  const goToReviewDetail = useCallback(({ id }) => {
    router.push(`/review/${id}`);
  }, []);

  if (!loading) {
    <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper>
        {list.map((image: any, index: number) => {
          const isLast = list.length - 1 === index;
          if (isLast) {
            return (
              <ReviewImage
                src={image.url}
                alt="리뷰이미지"
                key={index}
                ref={ref}
                onClick={() => goToReviewDetail(image)}
              />
            );
          } else {
            return (
              <ReviewImage
                src={image.url}
                alt="리뷰이미지"
                key={index}
                onClick={() => goToReviewDetail(image)}
              />
            );
          }
        })}
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div`
  padding: 16px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const ReviewImage = styled.img`
  width: calc(100% - 24px / 3);
  margin-bottom: 8px;
`;

export default React.memo(review);
