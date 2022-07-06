import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText, FlexBetween } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { getCustomDate } from '@utils/destination';
import router from 'next/router';
import { ISearchReviews } from '@model/index';
import { compose } from '@reduxjs/toolkit';
interface IProps {
  review: ISearchReviews;
  clickImgViewHandler: (imgUrlForViwer: string[]) => void;
}

const CompleteReviewItem = ({ review, clickImgViewHandler }: IProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  const { dayFormatter } = getCustomDate(new Date(review.createdAt));

  const isContentHide = review.content.length >= 280;

  console.log(review, 'review');
  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <FlexBetween padding="0 0 16px 0">
              <TextH5B onClick={() => router.push(`/menu/${review.menuId}`)}>{review.menuName}</TextH5B>
              <TextH6B
                pointer
                color={theme.greyScale65}
                textDecoration="underline"
                onClick={() => router.push(`/mypage/review/edit/${review.id}?menuId=${review.menuId}`)}
              >
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
            <ReviewBody isShow={isShow}>
              <TextB3R>{review.content}</TextB3R>
            </ReviewBody>
            {isContentHide ? (
              isShow ? (
                <TextH6B
                  padding="0 0 4px 0"
                  color={theme.greyScale65}
                  textDecoration="underLine"
                  onClick={() => setIsShow(!isShow)}
                >
                  전체 보기
                </TextH6B>
              ) : (
                <TextH6B
                  padding="0 0 4px 0"
                  color={theme.greyScale65}
                  textDecoration="underLine"
                  onClick={() => setIsShow(!isShow)}
                >
                  접기
                </TextH6B>
              )
            ) : (
              ''
            )}
            {review.images && (
              <ImgWrapper>
                {review.images?.map((img: any, index: number) => {
                  const imgUrlForViwer = review?.images?.map((item: any) => item.url);

                  return (
                    <ReviewImageWrapper
                      isFirst
                      onClick={() => imgUrlForViwer && clickImgViewHandler(imgUrlForViwer)}
                      key={index}
                    >
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
            {review.commentCreatedAt ? (
              <ReplyContent>
                <ReplyHeader>
                  <TextH6B color={theme.greyScale65}>{review.commenter}</TextH6B>
                  <TextB3R color={theme.greyScale65} padding="0 0 0 8px">
                    {review.commentCreatedAt}
                  </TextB3R>
                </ReplyHeader>
                <ReplyBody>
                  <TextB3R color={theme.greyScale65}>{review.comment}</TextB3R>
                </ReplyBody>
              </ReplyContent>
            ) : null}
          </ReviewContent>
        </Wrapper>
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

const ReviewBody = styled.div<{ isShow?: boolean }>`
  margin: 8px 0px;

  ${({ isShow }) => {
    if (isShow) {
      return css`
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      `;
    }
  }}
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
  /* height: 72px; */
  .rounded {
    border-radius: 8px;
  }
`;

const ReplyContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;
const ReplyHeader = styled.div`
  display: flex;
`;
const ReplyBody = styled.div`
  margin-top: 8px;
`;

const ReviewImageWrapper = styled.div<{ isFirst?: boolean }>`
  width: 72px;
  margin-right: ${({ isFirst }) => isFirst && 8}px;
  .rounded {
    border-radius: 8px;
  }
`;

export default CompleteReviewItem;
