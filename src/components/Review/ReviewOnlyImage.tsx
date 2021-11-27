import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import { TextH1B } from '@components/Text';
import { theme } from '@styles/theme';
/* TODO: rate 별 만들기  */

function ReviewOnlyImage({ reviews, goToReviewImages }: any) {
  console.log(reviews);
  return (
    <Container>
      <Wrapper>
        <Header>
          <Count>
            <TextH2B padding="0 4px 0 0">5.0</TextH2B>
            <TextH5B>{`(${reviews.length})`}</TextH5B>
          </Count>
          <Star>
            <SVGIcon name="mockStar" />
          </Star>
        </Header>
        <ReviewSwipe>
          {reviews.map((review: any, index: number) => {
            if (index > 3) return;
            if (reviews.length > 4 && index === 3) {
              return (
                <LastImgWrapper key={index} onClick={goToReviewImages}>
                  <LastImg>
                    <TextH1B color={theme.white}>
                      + {reviews.length - 4}
                    </TextH1B>
                  </LastImg>
                  <ReviewImage src={review?.url} alt="리뷰이미지" />
                </LastImgWrapper>
              );
            }

            return (
              <ReviewImage src={review?.url} alt="리뷰이미지" key={index} />
            );
          })}
        </ReviewSwipe>
      </Wrapper>
    </Container>
  );
}

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

const ReviewImage = styled.img`
  width: calc((100% - 24px) / 4);
  border-radius: 8px;
`;

const LastImgWrapper = styled.div`
  position: relative;
  width: calc((100% - 24px) / 4);
  > img {
    width: 100%;
    height: 100%;
  }
`;

const LastImg = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(36, 36, 36, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
export default React.memo(ReviewOnlyImage);
