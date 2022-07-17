import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { homePadding, theme } from '@styles/theme';
import { ReviewOnlyImage } from '@components/Pages/Review';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewDetailItem } from '@components/Pages/Review';
import { SET_IMAGE_VIEWER } from '@store/common';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useInfiniteQuery } from 'react-query';
import { ISearchReviews } from '@model/index';
import { getMenuDetailReviewApi, getMenuDetailReviewImageApi, getMenuDetailApi } from '@api/menu';
import { menuSelector, SET_MENU_ITEM, INIT_MENU_ITEM } from '@store/menu';
import { userForm } from '@store/user';
import { useInfiniteMenuReviews } from '@queries/menu';

/* TODO: 중복 코드 많음 , 리팩토링 */

const DEFAULT_SIZE = 10;

interface IProps {
  menuId: string;
}

const TotalReviewPage = ({ menuId }: IProps) => {
  const [page, setPage] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { me } = useSelector(userForm);

  const {
    data: menuDetail,
    error: menuError,
    isLoading: menuDeitalLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      const { data } = await getMenuDetailApi(Number(menuId)!);
      return data?.data;
    },
    {
      onSuccess: (data) => {
        dispatch(SET_MENU_ITEM(data));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, isLoading } =
    useInfiniteMenuReviews({
      id: Number(menuId)!,
      size: DEFAULT_SIZE,
      page,
    });

  const { data: reviewsImages, error: reviewsImagesError } = useQuery(
    'getMenuDetailReviewImages',
    async () => {
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewImageApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  useEffect(() => {
    return () => {
      dispatch(INIT_MENU_ITEM());
    };
  }, []);

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

  const goToReviewImages = useCallback(() => {
    router.push(`/menu/${menuId}/review/photo`);
  }, []);

  const goToReviewDetail = (id: number) => {
    router.push(`/menu/${menuId}/review/${id}`);
  };

  const clickImgViewHandler = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  const hasImageReview = reviewsImages?.images?.length! !== 0;

  return (
    <Container ref={parentRef}>
      <Wrapper>
        <ImageWrapper hasImageReview={hasImageReview}>
          {hasImageReview && (
            <ReviewOnlyImage
              reviewsImages={reviewsImages?.images!}
              goToReviewImages={goToReviewImages}
              goToReviewDetail={goToReviewDetail}
              averageRating={menuDetail?.rating!}
              totalReviews={menuDetail?.reviewCount!}
            />
          )}
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            borderRadius="8"
            margin="0 0 32px 0"
            onClick={() => router.push('/mypage/review')}
          >
            후기 작성하기 (최대 3,000포인트 적립)
          </Button>
        </ImageWrapper>
        <BorderLine height={8} />

        {data?.pages[0]?.result?.length !== 0 ? (
          data?.pages?.map((page: any, index: number) => {
            return (
              <List key={index}>
                {page.result?.map((review: ISearchReviews, index: number) => {
                  return <ReviewDetailItem review={review} key={index} clickImgViewHandler={clickImgViewHandler} />;
                })}
              </List>
            );
          })
        ) : (
          <EmptyWrapper>
            <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
              상품의 첫 번째 후기를 작성해주세요 :)
            </TextB2R>
          </EmptyWrapper>
        )}
      </Wrapper>
      <div className="last" ref={ref}></div>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;

  ${homePadding}
  .last {
    height: 20px;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  height: 50vh;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div<{ hasImageReview?: boolean }>`
  ${homePadding}
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 16px;

  ${({ hasImageReview }) => {
    if (!hasImageReview) {
      return css`
        justify-content: center;
        align-items: center;
        /* height: 50vh; */
      `;
    }
  }}
`;

const List = styled.div`
  padding-top: 32px;
  width: 100%;
`;

export async function getServerSideProps(context: any) {
  const { menuId } = context.query;

  return {
    props: { menuId },
  };
}

export default TotalReviewPage;
