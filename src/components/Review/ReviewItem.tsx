import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Tag';
import { theme, showMoreText } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Text';

/* TODO: 리뷰 사진 클릭 시 이미지 뷰어 */

function ReviewItem({ review, onClick }: any) {
  return (
    <Container>
      <Wrapper>
        <ImgWrapper>
          <ReviewImg src={review.url} />
        </ImgWrapper>
        <ReviewContent>
          <ReviewHeader>
            <Rating>
              <SVGIcon name="singleStar" />
              <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
            </Rating>
            <Tag
              backgroundColor={theme.brandColor5}
              color={theme.brandColor}
              margin="0 16px 0 0"
            >
              {review.order}번 째 구매
            </Tag>
          </ReviewHeader>
          <ReviewBody>
            <TextB3R>{review.content}</TextB3R>
          </ReviewBody>
        </ReviewContent>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
`;

const Wrapper = styled.div`
  background-color: ${theme.white};
  padding: 24px 0 24px 24px;
  border-radius: 8px;
  display: flex;
  width: 294px;
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const ReviewImg = styled.img`
  width: 72px;
  border-radius: 8px;
`;

const ReviewContent = styled.div`
  margin-left: 16px;
  width: 100%;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Rating = styled.div`
  display: flex;
`;

const ReviewBody = styled.div`
  margin-top: 8px;
  padding-right: 24px;
  ${showMoreText}
`;

export default ReviewItem;
