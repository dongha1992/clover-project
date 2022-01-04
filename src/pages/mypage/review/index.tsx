import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import TabList from '@components/Shared/TabList';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { TextB2R } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { MypageReviewItem, ReviewInfo } from '@components/Pages/Mypage/Review';
import { breakpoints } from '@utils/getMediaQuery';

/* 아이템 수 표기헤야해서 HEADER에 TabList 안붙이고 따로 뺌   */

const TAB_LIST = [
  { id: 1, text: '작성 예정', value: 'willWrite', link: '/mypage/review' },
  { id: 2, text: '작성 완료', value: 'completed', link: '/use' },
];

const ReviewPage = () => {
  const [selectedTab, setSelectedTab] = useState('/mypage/review');
  const [isShow, setIsShow] = useState(false);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getItemList();
  }, []);

  const getItemList = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const countObj = {
    '작성 예정': 123,
    '작성 완료': 55,
  };

  return (
    <Container>
      <FixedTab>
        <TabList
          tabList={TAB_LIST}
          onClick={selectTabHandler}
          selectedTab={selectedTab}
          countObj={countObj}
        />
      </FixedTab>
      <Wrapper>
        <ReviewInfo setIsShow={setIsShow} isShow={isShow} />
      </Wrapper>
      {!itemList.length ? (
        <Center>
          <TextB2R color={theme.greyScale65}>
            후기를 작성할 상품이 없습니다.
          </TextB2R>
        </Center>
      ) : (
        <Wrapper>
          <WillReviewItmesWrapper>
            {itemList.map((item, index) => (
              <div key={index}>
                <MypageReviewItem menu={item} />
                {itemList.length - 1 !== index && (
                  <BorderLine height={1} margin="24px 0" />
                )}
              </div>
            ))}
          </WillReviewItmesWrapper>
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div``;
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

const FixedTab = styled.div`
  position: fixed;
  width: 100%;
  left: calc(50%);
  right: 0;
  background-color: white;
  max-width: ${breakpoints.mobile}px;
  width: 100%;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export default ReviewPage;
