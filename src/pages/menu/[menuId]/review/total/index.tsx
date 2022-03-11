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
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';

const TotalReviewPage = ({ menuId }: any) => {
  const [reviews, setReviews] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getTempItemList = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${BASE_URL}/itemList`);
    const selectedMenuItem: any = data.data.find((item: any) => item.id === Number(menuId));
    setReviews(selectedMenuItem.reviews);
    setIsLoading(false);
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

  useEffect(() => {
    getTempItemList();
  }, []);

  const hasReivew = reviews.length > 0;

  if (isLoading) {
    <div>로딩</div>;
  }
  return (
    <Container>
      <Wrapper hasReivew={hasReivew}>
        {hasReivew ? (
          <ReviewOnlyImage reviews={reviews} goToReviewImages={goToReviewImages} goToReviewDetail={goToReviewDetail} />
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
        {reviews?.map((review: any, index: number) => {
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
