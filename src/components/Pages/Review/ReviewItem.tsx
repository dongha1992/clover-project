import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
const ReviewItem = ({ review, onClick }: any) => {
  return (
    <Container onClick={onClick}>
      <Wrapper>
        <ImgWrapper>
          <ReviewImg src={IMAGE_S3_URL + review.url} />
        </ImgWrapper>
        <ReviewContent>
          <ReviewHeader>
            <Rating>
              <SVGIcon name="singleStar" />
              <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
            </Rating>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor} margin="0 16px 0 0">
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
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
`;

const Wrapper = styled.div`
  background-color: ${theme.white};
  padding: 16px 0 16px 16px;
  border-radius: 8px;
  display: flex;
  width: 294px;
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const ReviewImg = styled.img`
  width: 72px;
  height: 72px;
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
