import React, { useState } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText, FlexBetween } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import getCustomDate from '@utils/getCustomDate';

interface IProps {
  review: any;
  isLast: boolean;
  clickImgViewHandler: (imgUrlForViwer: string[]) => void;
}

const CompleteReviewItem = ({ review, clickImgViewHandler, isLast }: IProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  review.reviewImg = [
    {
      url: '/menu/origin/172_20191023170649',
    },
  ];
  const { dayFormatter } = getCustomDate(new Date(review.createdAt));

  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <FlexBetween padding="0 0 16px 0">
              <TextH5B>{review.menuName}</TextH5B>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                편집
              </TextH6B>
            </FlexBetween>
            <ReviewHeader>
              <RatingAndUser>
                <Rating>
                  <SVGIcon name="singleStar" />
                  <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
                </Rating>
                <UserInfo>
                  <TextH6B color={theme.greyScale65} padding="0 8px 0 0">
                    {review.userNickName}
                  </TextH6B>
                  <TextB3R color={theme.greyScale65}>{dayFormatter}</TextB3R>
                </UserInfo>
              </RatingAndUser>
            </ReviewHeader>
            <ReviewBody>
              <TextB3R>{review.content.repeat(100)}</TextB3R>
              {isShow ? (
                <TextH6B color={theme.greySacle65} textDecoration="underLine">
                  전체 보기
                </TextH6B>
              ) : (
                <TextH6B color={theme.greySacle65} textDecoration="underLine">
                  더보기
                </TextH6B>
              )}
            </ReviewBody>
            {review.reviewImg && (
              <ImgWrapper>
                {review.reviewImg?.map((img: any, index: number) => {
                  const imgUrlForViwer = review.reviewImg.map((item: any) => item.url);
                  return (
                    <ReviewImageWrapper isFirst onClick={() => clickImgViewHandler(imgUrlForViwer)} key={index}>
                      <Image
                        src={IMAGE_S3_URL + img.url}
                        alt="리뷰이미지"
                        width={'100%'}
                        height={'100%'}
                        layout="responsive"
                        className="rounded"
                      />
                    </ReviewImageWrapper>
                  );
                })}
              </ImgWrapper>
            )}
          </ReviewContent>
        </Wrapper>
        {/* {!isLast && <BorderLine margin="0 0 24px 0" height={1} />} */}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: ${theme.white};
  border-radius: 8px;
  display: flex;
  width: 100%;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
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

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const UserInfo = styled.div`
  display: flex;
  margin-top: 4px;
`;

const RatingAndUser = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImgWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 75px;
  .rounded {
    border-radius: 8px;
  }
`;

const ReviewImageWrapper = styled.div<{ isFirst?: boolean }>`
  width: calc((100% - 24px) / 4);
  margin-right: ${({ isFirst }) => isFirst && 8}px;
  .rounded {
    border-radius: 8px;
  }
`;

export default CompleteReviewItem;
