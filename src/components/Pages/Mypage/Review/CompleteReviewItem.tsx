import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SVGIcon } from '@utils/common';
import { theme, FlexRowStart, FlexBetweenStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import { getCustomDate } from '@utils/destination';
import router from 'next/router';
import { ICompletionReviews } from '@model/index';
import Image from '@components/Shared/Image';
import { showImageViewer } from '@store/imageViewer';
import { useDispatch } from 'react-redux';

const MAX_LINE = 5;
interface IProps {
  review: ICompletionReviews;
  goToReviewDetail: ({ url, id, menuId, name }: { url: string; id: number; menuId: number; name: string }) => void;
  deleteReviewHandler: (id: number) => void;
}

const CompleteReviewItem = ({ review, goToReviewDetail, deleteReviewHandler }: IProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [isContentHide, setIsContentHide] = useState<boolean>(false);
  const { dayFormatter } = getCustomDate(review.createdAt);
  const dispatch = useDispatch();

  useEffect(() => {
    const lines = review.content?.split(/\r|\r\n|\n/);
    const count = lines?.length;
    if (count >= MAX_LINE || review.content.length >= 280) {
      setIsContentHide(true);
    }
  });

  const imageClickHandler = (startIndex: number) => {
    const images = review?.reviewImages.map((item: any) => item.url);
    dispatch(showImageViewer({ images, startIndex, isShow: true }));
  };

  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <FlexBetweenStart padding="0 0 16px 0">
              <FlexRowStart onClick={() => router.push(`/menu/${review.menuId}`)} pointer>
                <MenuImgWrapper>
                  <Image
                    src={review?.menuImage?.url}
                    alt="상품이미지"
                    width={'100%'}
                    height={'100%'}
                    layout="responsive"
                    className="rounded"
                  />
                </MenuImgWrapper>
                <TextH5B margin="0 0 0 8px" pointer>
                  {review.displayMenuName}
                </TextH5B>
              </FlexRowStart>
              <TextH6B
                pointer
                color={theme.greyScale65}
                textDecoration="underline"
                onClick={() => {
                  if (review.editable) {
                    goToReviewDetail({
                      url: review.menuImage.url,
                      menuId: review.menuId,
                      id: review.id,
                      name: review.displayMenuName!,
                    });
                  } else {
                    deleteReviewHandler(review.id);
                  }
                }}
              >
                {review.editable ? '수정' : '삭제'}
              </TextH6B>
            </FlexBetweenStart>
            <ReviewHeader>
              <RatingAndUser>
                <Rating>
                  <SVGIcon name="singleStar" />
                  <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
                </Rating>
                <UserInfo>
                  <TextH6B color={theme.greyScale65} padding="0 8px 0 0">
                    {review.userNickname}
                  </TextH6B>
                  <TextB3R color={theme.greyScale65}>{dayFormatter}</TextB3R>
                </UserInfo>
              </RatingAndUser>
            </ReviewHeader>
            <ReviewBody isShow={isShow}>
              <TextB2R>{review.content}</TextB2R>
            </ReviewBody>
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
            {review.reviewImages && (
              <ImgWrapper>
                {review.reviewImages?.map((img: any, index: number) => {
                  return (
                    <ReviewImageWrapper isFirst onClick={() => imageClickHandler(index)} key={index}>
                      <Image src={img.url} alt="리뷰이미지" width="72" height="72"></Image>
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
  padding: 24px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &:last-of-type {
    border-bottom: none;
  }
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
  margin: 8px 0;

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

  .rounded {
    border-radius: 8px;
  }
`;

const MenuImgWrapper = styled.div`
  width: 60px;
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
  height: 72px;
  margin-right: ${({ isFirst }) => isFirst && 8}px;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export default CompleteReviewItem;
