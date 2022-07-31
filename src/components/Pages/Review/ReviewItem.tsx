import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { IBestReviews } from '@model/index';
import { getImageApi } from '@api/image';
import { IMAGE_ERROR } from '@constants/menu';

interface IProps {
  review: IBestReviews;
  onClick: (review: IBestReviews) => void;
}

const ReviewItem = ({ review, onClick }: IProps) => {
  // const getResizeImg = async ({ width, url }: { width: number; url: string }) => {
  //   const data = await getImageApi(width, url);
  //
  // };

  //TODO TAYLER : s3에서 리뷰 이미지 mock으로 받는 게 있어서 임시로 분기. 나중에 제거

  const hasImage = review?.images.length !== 0;
  const url = hasImage && review?.images[0]?.url;
  const fromS3 = url && url?.includes('/menu');
  const s3Url = IMAGE_S3_URL + url;

  return (
    <Container onClick={() => onClick(review)}>
      <Wrapper>
        {hasImage && (
          <ImgWrapper>
            {/* {getResizeImg({ width: 500, url: review?.images[0]?.url! })} */}
            <ReviewImg src={fromS3 ? s3Url : process.env.REVIEW_IMAGE_URL! + url} alt="후기사진" />
          </ImgWrapper>
        )}

        <ReviewContent>
          <ReviewHeader>
            <Rating>
              <SVGIcon name="singleStar" />
              <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
            </Rating>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor} margin="0 16px 0 0">
              {review?.orderType === 'SUBSCRIPTION' ? review?.tag : `${review?.tag}번째 구매`}
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
