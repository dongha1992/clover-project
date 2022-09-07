import React from 'react';
import styled from 'styled-components';
import { ReviewDetailItem } from '@components/Pages/Review';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { getReviewDetailApi } from '@api/menu';
import { show, hide } from '@store/loading';

const ReviewDetailPage = ({ contentId, menuId }: { contentId: string; menuId: string }) => {
  const dispatch = useDispatch();

  const { data: menuReview, isLoading } = useQuery(
    'getReviewDetail',
    async () => {
      dispatch(show());
      const params = {
        id: Number(menuId),
        menuReviewId: Number(contentId),
      };
      const { data } = await getReviewDetailApi(params);
      return data.data.menuReview;
    },
    {
      onSuccess: (data) => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Container>
      <ReviewDetailItem review={menuReview} isDetailPage />
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
