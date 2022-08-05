import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B, TextH4B, TextH1B } from '@components/Shared/Text';
import { theme, responsiveImg, responsiveImgWrapper } from '@styles/theme';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { StarRating } from '@components/StarRating';
import { IDetailImage } from '@model/index';

interface IProps {
  reviewsImages: IDetailImage[];
  goToReviewImages: () => void;
  goToReviewDetail: (id: number) => void;
  averageRating: number;
  totalReviews: number;
}

const ReviewOnlyImage = ({
  reviewsImages,
  goToReviewImages,
  goToReviewDetail,
  averageRating,
  totalReviews,
}: IProps) => {
  return (
    <Container>
      <Wrapper>
        <Header>
          <Count>
            <TextH2B padding="0 4px 0 0">{averageRating}</TextH2B>
            <TextH5B>{`(${totalReviews})`}</TextH5B>
          </Count>
          <Star>
            <StarRating rating={Number(averageRating)} width="18" height="18" />
          </Star>
        </Header>
        <ReviewSwipe>
          {reviewsImages?.map((review: any, index: number) => {
            if (index > 3) return;
            if (reviewsImages?.length > 4 && index === 3) {
              const numOfImages = reviewsImages.length - 4;
              return (
                <LastImgWrapper key={index} onClick={goToReviewImages}>
                  <LastImg>
                    <TextH4B color={theme.white}>+ {numOfImages.toLocaleString()}</TextH4B>
                  </LastImg>
                  <img src={process.env.IMAGE_SERVER_URL + review.url} alt="리뷰이미지" />
                </LastImgWrapper>
              );
            }
            return (
              <ReviewImgWrapper key={index} onClick={() => goToReviewDetail(review.contentId)}>
                <img src={process.env.IMAGE_SERVER_URL + review.url} alt="리뷰이미지" key={index} />
              </ReviewImgWrapper>
            );
          })}
        </ReviewSwipe>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.div``;

const ReviewSwipe = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  margin: 16px 0 24px 0;
  cursor: pointer;
  position: relative;
`;

const ReviewImgWrapper = styled.div`
  width: calc((100% - 24px) / 4);
  margin-right: 6px;
  ${responsiveImgWrapper}
  > img {
    ${responsiveImg}
  }
  > span {
    border-radius: 8px;
  }
`;

const LastImgWrapper = styled.div`
  width: calc((100% - 24px) / 4);
  ${responsiveImgWrapper}
  > img {
    ${responsiveImg}
  }
  > span {
    border-radius: 8px;
  }
`;

const LastImg = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(36, 36, 36, 0.5);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
export default React.memo(ReviewOnlyImage);
