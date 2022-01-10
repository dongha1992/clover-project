import React from 'react';
import { ScrollHorizonList } from '@styles/theme';
import { ReviewItem } from '@components/Pages/Review';

const ReviewList = ({ reviews, onClick }: any) => {
  return (
    <ScrollHorizonList>
      {reviews.map((review: any, index: number) => (
        <ReviewItem review={review} key={index} onClick={onClick} />
      ))}
    </ScrollHorizonList>
  );
};

export default React.memo(ReviewList);