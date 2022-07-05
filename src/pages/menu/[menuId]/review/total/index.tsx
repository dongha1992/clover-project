import React, { useState, useCallback, useEffect } from 'react';
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
import { useQuery } from 'react-query';
import { getMenuDetailReviewApi, getMenuDetailReviewImageApi, getReviewAvailabilityApi } from '@api/menu';
import { menuSelector } from '@store/menu';

/* TODO: static 으로 변경, 이미지만 보여주는 리뷰와 이미지+글자 리뷰 데이터 어떻게 나눌지 */
/* TODO: 중복 코드 많음 , 리팩토링 */

const TotalReviewPage = ({ menuId }: any) => {
  const dispatch = useDispatch();
  const { menuItem } = useSelector(menuSelector);

  const { rating, reviewCount } = menuItem;

  const {
    data: reviews,
    error,
    isLoading,
  } = useQuery(
    'getMenuDetailReview',
    async () => {
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewApi(params);

      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

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

  const { data: reviewAvailability, error: availabilityError } = useQuery(
    'getReviewAvailability',
    async () => {
      const { data } = await getReviewAvailabilityApi(Number(menuId)!);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const goToReviewImages = useCallback(() => {
    router.push(`/menu/${menuId}/review/photo`);
  }, []);

  const goToReviewDetail = (id: number) => {
    router.push(`/menu/${menuId}/review/${id}`);
  };

  const clickImgViewHandler = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  const hasImageReview = reviewsImages?.images?.length! !== 0;
  const hasReivews = reviews?.menuReviews.length !== 0;

  return (
    <Container>
      <Wrapper hasImageReview={hasImageReview}>
        {hasImageReview && (
          <ReviewOnlyImage
            reviewsImages={reviewsImages?.images!}
            goToReviewImages={goToReviewImages}
            goToReviewDetail={goToReviewDetail}
            averageRating={rating}
            totalReviews={reviewCount}
          />
        )}
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          borderRadius="8"
          margin="0 0 32px 0"
          onClick={() => router.push(`/mypage/review/write/${menuId}`)}
        >
          후기 작성하기 (최대 3,000포인트 적립)
        </Button>
      </Wrapper>
      <BorderLine height={8} />
      <ReviewWrapper>
        {hasReivews ? (
          <>
            {reviews?.menuReviews?.map((review: any, index: number) => {
              return <ReviewDetailItem review={review} key={index} clickImgViewHandler={clickImgViewHandler} />;
            })}
          </>
        ) : (
          <Wrapper>
            <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
              상품의 첫 번째 후기를 작성해주세요 :)
            </TextB2R>
          </Wrapper>
        )}
      </ReviewWrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div<{ hasImageReview?: boolean }>`
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
        height: 50vh;
      `;
    }
  }}
`;

const ReviewWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
  margin-bottom: 88px;
  ${homePadding}
`;

export async function getServerSideProps(context: any) {
  const { menuId } = context.query;

  return {
    props: { menuId },
  };
}

export default TotalReviewPage;
