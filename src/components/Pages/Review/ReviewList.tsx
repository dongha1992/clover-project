import React from 'react';
import { ScrollHorizonList } from '@styles/theme';
import { ReviewItem } from '@components/Pages/Review';
import { pipe, indexBy } from '@fxts/core';
import { Obj } from '@model/index';

const ReviewList = ({ reviews, onClick }: any) => {
  const idByReviewImg: Obj = pipe(
    reviews.searchReviewImages,
    indexBy((item: any) => item.menuReviewId)
  );

  return (
    <ScrollHorizonList height="106px">
      {reviews.searchReviews.map((review: any, index: number) => {
        return (
          <ReviewItem
            review={review}
            reviewImg={idByReviewImg[review.id]}
            key={index}
            onClick={() => onClick(review)}
          />
        );
      })}
    </ScrollHorizonList>
  );
};

export default React.memo(ReviewList);
