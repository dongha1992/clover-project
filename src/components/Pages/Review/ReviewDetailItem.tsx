import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Shared/Tag';
import { theme, showMoreText, homePadding } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';

function ReviewDetailItem({ review, isDetailPage, clickImgViewHandler }: any) {
  return (
    <>
      <Container>
        <Wrapper>
          <ReviewContent>
            <ReviewHeader>
              <RatingAndUser>
                <Rating>
                  <SVGIcon name="singleStar" />
                  <TextH5B padding="0 0 0 4px">{review.rating}</TextH5B>
                </Rating>
                <UserInfo>
                  <TextH6B color={theme.greyScale65} padding="0 8px 0 0">
                    {review.user}
                  </TextH6B>
                  <TextB3R color={theme.greyScale65}>
                    {review.createdAt}
                  </TextB3R>
                </UserInfo>
              </RatingAndUser>
              <TagWrapper>
                <Tag
                  backgroundColor={theme.brandColor5}
                  color={theme.brandColor}
                >
                  {review.order}번 째 구매
                </Tag>
              </TagWrapper>
            </ReviewHeader>
            <ReviewBody>
              <TextB3R>{review.content}</TextB3R>
              <ImgWrapper>
                {review.images.map((img: any, index: number) => {
                  if (index > 1) return;
                  return (
                    <ReviewImage
                      src={img}
                      key={index}
                      isFirst
                      onClick={() => clickImgViewHandler(review.images)}
                    />
                  );
                })}
              </ImgWrapper>
              {!isDetailPage && review.reply ? (
                <ReplyContent>
                  <ReplyHeader>
                    <TextH6B color={theme.greyScale65}>
                      {review.reply.name}
                    </TextH6B>
                    <TextB3R color={theme.greyScale65} padding="0 0 0 8px">
                      {review.reply.createdAt}
                    </TextB3R>
                  </ReplyHeader>
                  <ReplyBody>
                    <TextB3R color={theme.greyScale65}>
                      {review.reply.content}
                    </TextB3R>
                  </ReplyBody>
                </ReplyContent>
              ) : null}
            </ReviewBody>
          </ReviewContent>
        </Wrapper>
      </Container>
      <BorderLine margin="0 0 24px 0" height={1} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
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
  ${showMoreText}
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
  overflow: hidden;
  width: 100%;
  margin: 16px 0 24px 0;
`;

const ReviewImage = styled.img<{ isFirst?: boolean }>`
  width: calc((100% - 24px) / 4);
  border-radius: 8px;
  margin-right: ${({ isFirst }) => isFirst && 8}px;
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
