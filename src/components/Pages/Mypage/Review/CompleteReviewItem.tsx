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
import { ICompletionReviews } from '@model/index';
import { getImageApi } from '@api/image';

// 빌드에러남
// import { ThumborImage } from 'react-thumbor-img';

interface IProps {
  review: ICompletionReviews;
  clickImgViewHandler: (imgUrlForViwer: string[]) => void;
  goToReviewDetail: ({ url, id, menuId, name }: { url: string; id: number; menuId: number; name: string }) => void;
}

const CompleteReviewItem = ({ review, clickImgViewHandler, goToReviewDetail }: IProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  const { dayFormatter } = getCustomDate(new Date(review.createdAt));

  const isContentHide = review.content.length >= 280;

  const getResizeImg = async ({ width, url }: { width: number; url: string }) => {
    const formatUrl = url.replace('/image', '');

    const params = {
      width,
      url: formatUrl,
    };

    // const params = {
    //   width,
    //   url,
    // };

    const data = await getImageApi(params);
    console.log(data);
    return data;
  };

  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <FlexBetween padding="0 0 16px 0">
              <TextH5B pointer onClick={() => router.push(`/menu/${review.menuId}`)}>
                {review.menuName}
              </TextH5B>
              <TextH6B
                pointer
                color={theme.greyScale65}
                textDecoration="underline"
                onClick={() =>
                  goToReviewDetail({
                    url: review.menuImage.url,
                    menuId: review.menuId,
                    id: review.id,
                    name: review.menuName,
                  })
                }
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
            {review.reviewImages && (
              <ImgWrapper>
                {review.reviewImages?.map((img: any, index: number) => {
                  const imgUrlForViwer = review?.reviewImages?.map((item: any) => item.url);
                  return (
                    <ReviewImageWrapper
                      isFirst
                      onClick={() => imgUrlForViwer && clickImgViewHandler(imgUrlForViwer)}
                      key={index}
                    >
                      <Image
                        src={process.env.REVIEW_IMAGE_URL + img.url}
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
            {review.commentCreatedAt && review.comment ? (
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
