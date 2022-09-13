import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import Image from '@components/Shared/Image';
import { IBestReviews } from '@model/index';

interface IProps {
  review: IBestReviews;
  onClick: (review: IBestReviews) => void;
}

const ReviewItem = ({ review, onClick }: IProps) => {
  const hasImage = review?.images.length !== 0;
  const url = hasImage ? review?.images[0]?.url : '';

  return (
    <Container onClick={() => onClick(review)}>
      <Wrapper>
        {hasImage && (
          <ImgWrapper>
            <Image src={url} alt="후기사진" width="72px" height="72px"></Image>
          </ImgWrapper>
        )}

        <ReviewContent>
          <ReviewHeader>
            <Rating>
              <SVGIcon name="singleStar" />
              <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
            </Rating>
            {review?.tag?.length! > 0 && (
              <Tag backgroundColor={theme.brandColor5} color={theme.brandColor} margin="0 16px 0 0">
                {/* {review?.orderType === 'SUBSCRIPTION' ? review?.tag : `${review?.tag}번째 구매`} */}
                {review?.tag}
              </Tag>
            )}
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
  width: 100%;
  /* margin-right: 16px; */
`;

const Wrapper = styled.div`
  background-color: ${theme.white};
  padding: 16px;
  border-radius: 8px;
  display: flex;
  width: 100%;
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
  width: 100%;
  margin-top: 8px;
  padding-right: 24px;
  ${showMoreText}
`;

export default React.memo(ReviewItem);
