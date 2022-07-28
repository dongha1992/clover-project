import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import { theme, showMoreText } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { IMAGE_S3_URL } from '@constants/mock';
import Image from 'next/image';
import { getImageApi } from '@api/image';

interface IProps {
  review: any;
  isDetailPage?: boolean;
  clickImgViewHandler?: (imgUrlForViwer: string[], index: number) => void;
}

const getResizeImg = async ({ width, url }: { width: number; url: string }) => {
  const params = {
    width,
    url,
  };
  const data = await getImageApi(params);

  return data;
};

const MAX_LINE = 5;

const ReviewDetailItem = ({ review, isDetailPage, clickImgViewHandler }: IProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [isContentHide, setIsContentHide] = useState<boolean>(false);

  useEffect(() => {
    const lines = review?.content?.split(/\r|\r\n|\n/);
    const count = lines?.length;
    if (count >= MAX_LINE || review?.content.length >= 280) {
      setIsContentHide(true);
    }
  }, []);

  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <ReviewHeader>
              <RatingAndUser>
                <Rating>
                  <SVGIcon name="singleStar" />
                  <TextH5B padding="0 0 0 4px">{review?.rating >= 5 ? 5 : review?.rating}</TextH5B>
                </Rating>
                <UserInfo>
                  <TextH6B color={theme.greyScale65} padding="0 8px 0 0">
                    {review?.userNickName}
                  </TextH6B>
                  <TextB3R color={theme.greyScale65}>{review?.createdAt}</TextB3R>
                </UserInfo>
              </RatingAndUser>
              <TagWrapper>
                <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
                  {review?.tag}번째 구매
                </Tag>
              </TagWrapper>
            </ReviewHeader>
            <ReviewBody>
              <TextBody isShow={isShow}>
                <TextB3R>{review?.content}</TextB3R>
              </TextBody>
              {isContentHide ? (
                isShow ? (
                  <TextH6B
                    padding="0 0 4px 0"
                    color={theme.greyScale65}
                    textDecoration="underLine"
                    onClick={() => setIsShow(!isShow)}
                    pointer
                  >
                    전체 보기
                  </TextH6B>
                ) : (
                  <TextH6B
                    padding="0 0 4px 0"
                    color={theme.greyScale65}
                    textDecoration="underLine"
                    onClick={() => setIsShow(!isShow)}
                    pointer
                  >
                    접기
                  </TextH6B>
                )
              ) : (
                ''
              )}
              <ImgWrapper>
                {review?.images?.map((img: any, index: number) => {
                  //TODO TAYLER : s3에서 리뷰 이미지 mock으로 받는 게 있어서 임시로 분기. 나중에 제거
                  if (index > 1) return;
                  const fromS3 = img.url.includes('/menu');
                  const s3Url = IMAGE_S3_URL + img?.url;
                  const imgUrlForViwer: string[] = review?.images.map((item: any) => item.url);
                  return (
                    <ReviewImageWrapper
                      isFirst
                      onClick={() => clickImgViewHandler && clickImgViewHandler(imgUrlForViwer, index)}
                      key={index}
                    >
                      <img
                        src={fromS3 ? s3Url : process.env.REVIEW_IMAGE_URL + img.url}
                        // src={fromS3 ? s3Url : getResizeImg({ width: 500, url: img.url })}
                        alt="리뷰이미지"
                        width={'100%'}
                        height={'100%'}
                        className="rounded"
                      />
                    </ReviewImageWrapper>
                  );
                })}
              </ImgWrapper>
              {!isDetailPage && review?.comment ? (
                <ReplyContent>
                  <ReplyHeader>
                    <TextH6B color={theme.greyScale65}>{review?.commenter}</TextH6B>
                    <TextB3R color={theme.greyScale65} padding="0 0 0 8px">
                      {review?.commentCreatedAt}
                    </TextB3R>
                  </ReplyHeader>
                  <ReplyBody>
                    <TextB3R color={theme.greyScale65}>{review?.comment}</TextB3R>
                  </ReplyBody>
                </ReplyContent>
              ) : null}
            </ReviewBody>
          </ReviewContent>
        </Wrapper>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const TextBody = styled.div<{ isShow?: boolean }>`
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
`;

const UserInfo = styled.div`
  display: flex;
  margin-top: 4px;
`;

const RatingAndUser = styled.div`
  display: flex;
  flex-direction: column;
`;

const TagWrapper = styled.div``;
const ImgWrapper = styled.div`
  display: flex;
  /* overflow: hidden; */
  width: 100%;
  margin: 16px 0 24px 0;
`;

const ReviewImageWrapper = styled.div<{ isFirst?: boolean }>`
  width: 72px;
  height: 72px;
  margin-right: ${({ isFirst }) => isFirst && 8}px;
  .rounded {
    object-fit: cover;
    width: 100%;
    border-radius: 8px;
  }
`;

const ReplyContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
`;
const ReplyHeader = styled.div`
  display: flex;
`;
const ReplyBody = styled.div`
  margin-top: 8px;
`;
export default ReviewDetailItem;
