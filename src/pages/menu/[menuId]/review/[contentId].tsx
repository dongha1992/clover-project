import React from 'react';
import styled from 'styled-components';
import { ReviewDetailItem } from '@components/Pages/Review';
import { homePadding } from '@styles/theme';
import { useDispatch } from 'react-redux';
import { SET_IMAGE_VIEWER } from '@store/common';
import { useQuery } from 'react-query';
import { getReviewDetailApi } from '@api/menu';
import assignIn from 'lodash-es/assignIn';

const ReviewDetailPage = ({ contentId }: { contentId: string }) => {
  const dispatch = useDispatch();

  const {
    data: menuReview,
    error,
    isLoading,
  } = useQuery(
    'getReviewDetail',
    async () => {
      const params = {
        id: 9,
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

  const clickImgViewHandler = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
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
  ${homePadding}
`;

export async function getServerSideProps(context: any) {
  const { contentId } = context.query;
  return {
    props: { contentId },
  };
}

export default ReviewDetailPage;
