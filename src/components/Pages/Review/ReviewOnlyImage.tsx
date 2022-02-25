import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { TextH1B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import StarRatingComponent from 'react-star-rating-component';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';

const ReviewOnlyImage = ({ reviews, goToReviewImages, goToReviewDetail }: any) => {
  return (
    <Container>
      <Wrapper>
        <Header>
          <Count>
            <TextH2B padding="0 4px 0 0">5.0</TextH2B>
            <TextH5B>{`(${reviews.length})`}</TextH5B>
          </Count>
          <Star>
            <StarRatingComponent
              name="rate"
              editing={false}
              starCount={5}
              value={4.0}
              renderStarIcon={(index, value) => {
                return <SVGIcon name={index <= value ? 'singleStar' : 'singleStarEmpty'} />;
              }}
              renderStarIconHalf={(index, value) => {
                return <SVGIcon name="singleStarHalf" />;
              }}
            />
          </Star>
        </Header>
        <ReviewSwipe>
          {reviews.map((review: any, index: number) => {
            if (index > 3) return;
            if (reviews.length > 4 && index === 3) {
              return (
                <LastImgWrapper key={index} onClick={goToReviewImages}>
                  <LastImg>
                    <TextH1B color={theme.white}>+ {reviews.length - 4}</TextH1B>
                  </LastImg>
                  <Image
                    src={IMAGE_S3_URL + review?.imageUrl[0]}
                    alt="리뷰이미지"
                    width={'100%'}
                    height={'100%'}
                    layout="responsive"
                  />
                </LastImgWrapper>
              );
            }
            return (
              <ReviewImgWrapper key={index} onClick={() => goToReviewDetail(review.id)}>
                <Image
                  src={IMAGE_S3_URL + review?.imageUrl[0]}
                  alt="리뷰이미지"
                  key={index}
                  width={'100%'}
                  height={'100%'}
                  layout="responsive"
                />
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
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  margin: 16px 0 24px 0;
`;

const ReviewImgWrapper = styled.div`
  width: calc((100% - 24px) / 4);

  > span {
    border-radius: 8px;
  }
`;

const LastImgWrapper = styled.div`
  position: relative;
  width: calc((100% - 24px) / 4);
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
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
export default React.memo(ReviewOnlyImage);
