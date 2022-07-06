import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import useFetch from '@hooks/useFetch';
import router from 'next/router';
import { getMenuDetailReviewImageApi } from '@api/menu';
import { useQuery } from 'react-query';
import { IMAGE_S3_URL } from '@constants/mock';
import { IDetailImage } from '@model/index';

/* 사진 전체 후기 */

const DEFAULT_SIZE = 30;

const ReviewPage = ({ menuId }: any) => {
  const [page, setPage] = useState<number>(0);
  let [list, setList] = useState<IDetailImage[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  let {
    data,
    error: reviewsImagesError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    'getMenuDetailReviewImages',
    async () => {
      const params = { id: Number(menuId)!, page, size: 10 };
      const { data } = await getMenuDetailReviewImageApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {
        setList((prev: IDetailImage[]) => [...prev, ...data.images]);
      },

      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId && !!page,
    }
  );

  const option = {
    root: parentRef.current, // 관찰대상의 부모요소를 지정
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
    if (ref.current) {
      observer.observe(ref?.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    const isLastPage = data?.pagination?.totalPage! <= page;

    if (isLastPage) return;

    if (page) {
      refetch();
    }
  }, [page]);

  const goToReviewDetail = useCallback(({ id }) => {
    router.push(`/menu/${menuId}/review/${id}`);
  }, []);

  if (isLoading || isFetching) {
    <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper ref={parentRef}>
        {list?.map((image: any, index: number) => {
          return (
            <ReviewImage
              src={IMAGE_S3_URL + image.url}
              alt="리뷰이미지"
              key={index}
              onClick={() => goToReviewDetail(image)}
            />
          );
        })}
        <div ref={ref} />
      </Wrapper>
    </Container>
  );
};

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

export async function getServerSideProps(context: any) {
  const { menuId } = context.query;
  return {
    props: { menuId },
  };
}

export default React.memo(ReviewPage);
