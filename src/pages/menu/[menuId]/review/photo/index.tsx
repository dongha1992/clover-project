import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import router from 'next/router';
import { getMenuDetailReviewImageApi } from '@api/menu';
import { useQuery } from 'react-query';
import { IDetailImage } from '@model/index';
import NextImage from '@components/Shared/Image';
import { show, hide } from '@store/loading';
import { useDispatch } from 'react-redux';

const DEFAULT_SIZE = 30;

const ReviewPage = ({ menuId }: any) => {
  const [page, setPage] = useState<number>(0);
  let [list, setList] = useState<IDetailImage[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  let {
    data,
    error: reviewsImagesError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    'getMenuDetailReviewImages',
    async () => {
      dispatch(show());
      const params = { id: Number(menuId)!, page, size: DEFAULT_SIZE };
      const { data } = await getMenuDetailReviewImageApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {
        setList((prev: IDetailImage[]) => [...prev, ...data.images]);
      },
      onSettled: () => {
        dispatch(hide());
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

  const goToReviewDetail = useCallback(({ contentId }) => {
    router.push(`/menu/${menuId}/review/${contentId}`);
  }, []);

  if (isLoading || isFetching) {
    <div></div>;
  }

  return (
    <Container>
      <Wrapper ref={parentRef}>
        {list?.map((image: any, index: number) => {
          return (
            <ImageWrapper key={index}>
              <NextImage
                src={image?.url}
                alt="리뷰이미지"
                onClick={() => goToReviewDetail(image)}
                width={'100%'}
                height={'100%'}
                layout="responsive"
                className="rounded"
              />
            </ImageWrapper>
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
  width: 100%;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: repeat(3, 1fr);
  .rounded {
    border-radius: 8px;
  }
`;

const ImageWrapper = styled.div`
  border: 1px solid #f2f2f2;
  border-radius: 8px;
`;

export async function getServerSideProps(context: any) {
  const { menuId } = context.query;
  return {
    props: { menuId },
  };
}

export default React.memo(ReviewPage);
