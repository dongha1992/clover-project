import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { homePadding, theme } from '@styles/theme';
import ReviewOnlyImage from '@components/Pages/Review/ReviewOnlyImage';
import BorderLine from '@components/Shared/BorderLine';
import ReviewDetailItem from '@components/Pages/Review/ReviewDetailItem';
import { SET_IMAGE_VIEWER } from '@store/common';
import router from 'next/router';
import { useDispatch } from 'react-redux';

const DetailBottomReview = ({ reviews, isSticky, menuId }: any) => {
  reviews = [...reviews, ...reviews, ...reviews];
  const dispatch = useDispatch();

  const hasReivew = reviews.length > 0;

  const goToReviewImages = useCallback(() => {
    router.push(`/menu/${menuId}/review/photo`);
  }, []);

  const goToTotalReview = () => {
    router.push(`/menu/${menuId}/review/total`);
  };

  const goToReviewDetail = (id: number) => {
    router.push(`/menu/${menuId}/review/${id}`);
  };

  const goToWriteReview = () => {
    router.push(`/mypage//review/write/${menuId}`);
  };

  const clickImgViewHandler = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  return (
    <Container isSticky={isSticky}>
      <Wrapper hasReivew={hasReivew}>
        {hasReivew ? (
          <ReviewOnlyImage
            reviews={reviews}
            goToReviewImages={goToReviewImages}
            goToReviewDetail={goToReviewDetail}
          />
        ) : (
          <TextB2R color={theme.greyScale65} padding="0 0 16px 0">
            상품의 첫 번째 후기를 작성해주세요 :)
          </TextB2R>
        )}
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          borderRadius="8"
          margin="0 0 32px 0"
          onClick={goToWriteReview}
        >
          후기 작성하기 (최대 3,000포인트 적립)
        </Button>
      </Wrapper>
      <BorderLine height={8} />
      <ReviewWrapper>
        {reviews.map((review: any, index: number) => {
          return (
            <ReviewDetailItem
              review={review}
              key={index}
              clickImgViewHandler={clickImgViewHandler}
            />
          );
        })}
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          borderRadius="8"
          onClick={goToTotalReview}
        >
          {reviews.length}개 후기 전체보기
        </Button>
      </ReviewWrapper>
    </Container>
  );
};

const Container = styled.div<{ isSticky: boolean }>`
  margin-top: ${({ isSticky }) => (isSticky ? 82 : 32)}px;
`;

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

export default React.memo(DetailBottomReview);