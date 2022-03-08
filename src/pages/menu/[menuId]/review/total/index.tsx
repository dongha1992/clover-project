import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { homePadding, theme } from '@styles/theme';
import { ReviewOnlyImage } from '@components/Pages/Review';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewDetailItem } from '@components/Pages/Review';
import { SET_IMAGE_VIEWER } from '@store/common';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { useQuery } from 'react-query';
import { Obj, ISearchReviews } from '@model/index';
import { groupBy, pipe } from '@fxts/core';

/* TODO: static 으로 변경, 이미지만 보여주는 리뷰와 이미지+글자 리뷰 데이터 어떻게 나눌지 */
/* TODO: 중복 코드 많음 , 리팩토링 */

const TotalReviewPage = ({ menuId }: any) => {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useQuery(
    'getMenuDetailReview',
    async () => {
      // const { data } = await getMenuDetailReviewApi(menuId);
      const { data } = await axios.get(`${BASE_URL}/review`);

      const { searchReviewImages, searchReviews } = data.data;
      const idByReviewImg: Obj = pipe(
        searchReviewImages,
        groupBy((review: any) => review.menuReviewId)
      );

      const mergedReviews = searchReviews.map((review: ISearchReviews) => {
        return { ...review, reviewImg: idByReviewImg[review.id] || [] };
      });

      return { searchReviewImages, searchReviews, mergedReviews };
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const getAverageRate = () => {
    const totalRating = data?.searchReviews.reduce((rating: number, review: ISearchReviews) => {
      return rating + review.rating;
    }, 0);
    return (totalRating / data?.searchReviews.length).toFixed(1);
  };

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

  const hasReivew = data?.mergedReviews.length > 0;

  return (
    <Container>
      <Wrapper hasReivew={hasReivew}>
        {hasReivew ? (
          <ReviewOnlyImage
            reviews={data?.searchReviewImages}
            goToReviewImages={goToReviewImages}
            goToReviewDetail={goToReviewDetail}
            averageRating={getAverageRate()}
            totalReviews={data?.searchReviews.length}
          />
        ) : (
          <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
            상품의 첫 번째 후기를 작성해주세요 :)
          </TextB2R>
        )}
        <Button backgroundColor={theme.white} color={theme.black} border borderRadius="8" margin="0 0 32px 0">
          후기 작성하기 (최대 3,000포인트 적립)
        </Button>
      </Wrapper>
      <BorderLine height={8} />
      <ReviewWrapper>
        {data?.mergedReviews.map((review: any, index: number) => {
          return <ReviewDetailItem review={review} key={index} clickImgViewHandler={clickImgViewHandler} />;
        })}
      </ReviewWrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div<{ hasReivew?: boolean }>`
  ${homePadding}
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ hasReivew }) => {
    if (!hasReivew) {
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
