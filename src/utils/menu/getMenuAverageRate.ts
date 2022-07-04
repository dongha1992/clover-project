import { ISearchReviews } from '@model/index';

interface IProps {
  reviews: ISearchReviews[];
  total: number;
}
export const getMenuAverageRate = ({ reviews, total }: IProps): string => {
  const totalRating = reviews?.reduce((rating: number, review: ISearchReviews) => {
    return rating + review.rating;
  }, 0);
  return (totalRating / total).toFixed(1);
};
