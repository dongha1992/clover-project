import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { homePadding, textBody3, theme } from '@styles/theme';
import { TextB2R } from '@components/Shared/Text';
import { WillWriteReviewItem, ReviewInfo } from '@components/Pages/Mypage/Review';
import { useQuery } from 'react-query';
import { getWillWriteReviews } from '@api/menu';
import { IWillWriteReview } from '@model/index';
import { useDispatch } from 'react-redux';
import { hide, show } from '@store/loading';

// 후기 작성 - 작성 예정
const ReviewSchedulePage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [isShow, setIsShow] = useState(false);

  const { data: willWriteList, error: willWriteError, isLoading: willWriteIsLoading } = useQuery<IWillWriteReview[]>(
    'getWillWriteReview',
    async () => {
      dispatch(show());
      const { data } = await getWillWriteReviews();
      return data.data;
    },
    {
      onSuccess: data => {},
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Container ref={ref}>
      <InfoWrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </InfoWrapper>
      {!willWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없어요 😭</TextB2R>
        </Center>
      )}
      <Wrapper>
        <WillReviewItmesWrapper>
          {willWriteList?.map((review, index) => (
            <WillWriteReviewItem key={index} review={review} />
          ))}
        </WillReviewItmesWrapper>
      </Wrapper>
      {willWriteList?.length! !== 0 && (
        <ReviewInfoWrapper>
          최근 1년 이내 후기 작성 내역만 조회 가능해요. (이전 후기 작성 내역은 고객센터로 문의해 주세요.)
        </ReviewInfoWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  /* padding-bottom: 24px; */
`;

const InfoWrapper = styled.div`
  ${homePadding}
  padding-top:74px;
  margin: 0 24px;
  position: relative;
`;

const Wrapper = styled.div`
  ${homePadding}
  margin-bottom:70px;
`;

const ReviewInfoWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background-color: ${theme.greyScale3};
  padding: 24px;
  color: ${theme.greyScale65};
  ${textBody3};
`;

const WillReviewItmesWrapper = styled.div`
  margin-top: 50px;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default ReviewSchedulePage;
