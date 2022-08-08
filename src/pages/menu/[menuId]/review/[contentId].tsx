import React from 'react';
import styled from 'styled-components';
import { ReviewDetailItem } from '@components/Pages/Review';
import { useDispatch } from 'react-redux';
import { SET_IMAGE_VIEWER } from '@store/common';
import { useQuery } from 'react-query';
import { getReviewDetailApi } from '@api/menu';

const ReviewDetailPage = ({ contentId, menuId }: { contentId: string; menuId: string }) => {
  const dispatch = useDispatch();

  const {
    data: menuReview,
    isLoading,
  } = useQuery(
    'getReviewDetail',
    async () => {
      const params = {
        id: Number(menuId),
        menuReviewId: Number(contentId),
      };
      const { data } = await getReviewDetailApi(params);
      return data.data.menuReview;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const clickImgViewHandler = (images: string[], index: number) => {
    const payload = { images, index };
    dispatch(SET_IMAGE_VIEWER(payload));
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <ReviewDetailItem review={menuReview} isDetailPage clickImgViewHandler={clickImgViewHandler} />
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 24px 24px 24px;
`;

export async function getServerSideProps(context: any) {
  const { contentId, menuId } = context.query;

  return {
    props: { contentId, menuId },
  };
}

export default ReviewDetailPage;
