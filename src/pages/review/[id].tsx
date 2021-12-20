import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import ReviewDetailItem from '@components/Pages/Review/ReviewDetailItem';
import { homePadding } from '@styles/theme';
function reviewDetail({ id }: any) {
  const [selectedReviewDetail, setSelectedReviewDetail] = useState<any>({});

  useEffect(() => {
    getReviewDetailItem();
  }, []);

  const getReviewDetailItem = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    const selectedReview: any = data
      .find((item: any) => item.id === Number(id))
      .reviews.find((item: any) => item.id === Number(id));
    setSelectedReviewDetail(selectedReview);
  };

  if (!Object.keys(selectedReviewDetail).length) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <ReviewDetailItem review={selectedReviewDetail} isDetailPage />
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id },
  };
}

export default reviewDetail;
