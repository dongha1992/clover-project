import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { fixedTab, homePadding, textBody3, theme } from '@styles/theme';
import { TabList } from '@components/Shared/TabList';
import { TextB2R } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { WillWriteReviewItem, ReviewInfo, CompleteReviewItem } from '@components/Pages/Mypage/Review';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useQuery } from 'react-query';
import { getCompleteReviews, getWillWriteReviews } from '@api/menu';
import { ICompletionReviews, IWillWriteReview } from '@model/index';
import { useDispatch } from 'react-redux';
import { SET_IMAGE_VIEWER, commonSelector } from '@store/common';
import { useSelector } from 'react-redux';
import useScrollCheck from '@hooks/useScrollCheck';

const TAB_LIST = [
  { id: 1, text: '작성 예정', value: 'willWrite', link: '/willWrite' },
  { id: 2, text: '작성 완료', value: 'completed', link: '/completed' },
];

const ReviewPage = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('/willWrite');
  const [isShow, setIsShow] = useState(false);

  // const { isScroll } = useSelector(commonSelector);
  const isScroll = useScrollCheck();

  const {
    data: willWriteList,
    error: willWriteError,
    isLoading: willWriteIsLoading,
  } = useQuery<IWillWriteReview[]>(
    'getWillWriteReview',
    async () => {
      const { data } = await getWillWriteReviews();
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: completeWriteList,
    error: completeWriteError,
    isLoading: completeIsLoading,
  } = useQuery<ICompletionReviews[]>(
    'getCompleteWriteReview',
    async () => {
      const { data } = await getCompleteReviews();
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const clickImgViewHandler = (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  const countObj = {
    '작성 예정': willWriteList?.length,
    '작성 완료': completeWriteList?.length,
  };

  const isWillWrite = selectedTab === '/willWrite';
  const isComplete = selectedTab === '/completed';

  if (completeIsLoading || willWriteIsLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <FixedTab scroll={isScroll}>
        <TabList tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} countObj={countObj} />
      </FixedTab>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </Wrapper>
      {isWillWrite && !willWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없습니다.</TextB2R>
        </Center>
      )}
      {isComplete && !completeWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없습니다.</TextB2R>
        </Center>
      )}
      {isWillWrite ? (
        <Wrapper>
          <WillReviewItmesWrapper>
            {willWriteList?.map((review, index) => (
              <div key={index}>
                <WillWriteReviewItem review={review} />
                {willWriteList?.length - 1 !== index && <BorderLine height={1} margin="24px 0" />}
              </div>
            ))}
          </WillReviewItmesWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <WillReviewItmesWrapper>
            {completeWriteList?.map((review, index) => {
              return (
                <div key={index}>
                  <CompleteReviewItem review={review} clickImgViewHandler={clickImgViewHandler} />
                  {completeWriteList?.length - 1 !== index && <BorderLine height={1} margin="24px 0" />}
                </div>
              );
            })}
          </WillReviewItmesWrapper>
        </Wrapper>
      )}
      {((isComplete && completeWriteList?.length! !== 0) || (isWillWrite && willWriteList?.length! !== 0)) && (
        <ReviewInfoWrapper>
          최근 1년 이내 구독 내역만 조회 가능해요. (이전 구독 내역은 고객센터로 문의해 주세요.)
        </ReviewInfoWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 24px;
`;

const FixedTab = styled.div<{ scroll: boolean }>`
  ${fixedTab};

  ${({ scroll }) => {
    if (scroll) {
      return css`
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
`;

const Wrapper = styled.div`
  ${homePadding}
`;

const ReviewInfoWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background-color: ${theme.greyScale3};
  padding: 24px;
  color: ${theme.greyScale65};
  ${textBody3};
  text-align: center;
`;

const WillReviewItmesWrapper = styled.div`
  margin-bottom: 24px;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export default ReviewPage;
