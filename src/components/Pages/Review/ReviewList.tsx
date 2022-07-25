import React from 'react';
import { ScrollHorizonList } from '@styles/theme';
import { ReviewItem } from '@components/Pages/Review';
import { Obj, IBestReviews } from '@model/index';

interface IProps {
  reviews: IBestReviews[];
  onClick: (review: IBestReviews) => void;
}

const ReviewList = ({ reviews, onClick }: IProps) => {
  return (
    <ScrollHorizonList>
      {reviews?.map((review: any, index: number) => {
        if (index > 3) return;
        return <ReviewItem review={review!} key={index} onClick={() => onClick(review)} />;
      })}
    </ScrollHorizonList>
  );
};

export default React.memo(ReviewList);
