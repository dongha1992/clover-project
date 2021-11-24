import React from 'react';
import { ScrollHorizonList } from '@styles/theme';
import ReviewItem from '@components/Review/ReviewItem';

function ReviewList({ reviews }: any) {
  return (
    <ScrollHorizonList>
      {reviews.map((review: any, index: number) => (
        <ReviewItem review={review} key={index} />
      ))}
    </ScrollHorizonList>
  );
}

export default React.memo(ReviewList);
