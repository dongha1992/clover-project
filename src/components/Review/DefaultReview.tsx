import React from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import Image from 'next/dist/client/image';
/* TODO: rate 별 만들기  */

function DefaultReview({ reviews }: any) {
  reviews = [...reviews, ...reviews, ...reviews];

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
            if (index > 3) {
              <LastImg>
                <ReviewImage src={review?.url} alt="리뷰이미지" />;
              </LastImg>;
            }
            return <ReviewImage src={review?.url} alt="리뷰이미지" />;
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
  max-width: 100%;
  overflow: hidden;
  margin: 16px 0 24px 0;
`;

const ReviewImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  margin-right: 8px;
`;

const LastImg = styled.div`
  background-color: rgba(36, 36, 36, 0.5);
`;
export default React.memo(DefaultReview);
