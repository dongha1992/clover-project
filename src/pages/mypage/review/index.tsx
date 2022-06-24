import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { fixedTab, homePadding, theme } from '@styles/theme';
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

const TAB_LIST = [
  { id: 1, text: '작성 예정', value: 'willWrite', link: '/willWrite' },
  { id: 2, text: '작성 완료', value: 'completed', link: '/completed' },
];

const ReviewPage = () => {
  const { isScroll } = useSelector(commonSelector);
  const [selectedTab, setSelectedTab] = useState('/willWrite');
  const [isShow, setIsShow] = useState(false);

  const dispatch = useDispatch();

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
      {selectedTab === '/willWrite' && !willWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없습니다.</TextB2R>
        </Center>
      )}
      {selectedTab === '/completed' && !completeWriteList?.length && (
        <Center>
          <TextB2R color={theme.greyScale65}>후기를 작성할 상품이 없습니다.</TextB2R>
        </Center>
      )}
      {selectedTab === '/willWrite' ? (
        <Wrapper>
          <WillReviewItmesWrapper>
            {willWriteList?.map((review, index) => (
              <div key={index}>
                <WillWriteReviewItem menu={review} />
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
    </Container>
  );
};

const Container = styled.div``;

const FixedTab = styled.div<{scroll: boolean}>`
  ${fixedTab};

  ${({scroll}) => {
    if (scroll) {
      return css `
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
`;

const Wrapper = styled.div`
  ${homePadding}
`;

const ReviewInfoWrapper = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px;
  margin: 24px 0;
`;

const WillReviewItmesWrapper = styled.div`
  margin-bottom: 24px;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

export default ReviewPage;
