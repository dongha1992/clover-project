import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Banner from '@components/Banner';
import MainTab from '@components/MainTab';
import { textH3, homePadding, theme } from '@styles/theme';
import { TextB3R } from '@components/Text';
import axios from 'axios';
import Item from '@components/Item';
import ScrollMenu from 'react-horizontal-scrolling-menu';

function Home() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(
      'https://gist.githubusercontent.com/dongha1992/7780e6a89c3feb8ffab266a8b9e34f12/raw/2088b0c308d7f0c9350e0109b4c78cee8bcfb73e/items.json'
    );
    setItemList(data);
  };

  return (
    <Container>
      <Banner />
      <SectionWrapper>
        <MainTab />
        <SectionTitle>MD 추천</SectionTitle>
        <ItemListCol>
          {itemList.map((item, index) => {
            return <Item item={item} key={index} />;
          })}
        </ItemListCol>
      </SectionWrapper>
      <LineBanner />
      <FlexSpace>
        <SectionTitle>이벤트 / 기획전 타이틀</SectionTitle>
        <TextB3R color={theme.greyScale65}>더보기</TextB3R>
      </FlexSpace>
      <Banner />
      <SectionWrapper>
        <ItemListRow></ItemListRow>
      </SectionWrapper>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 56px;
  width: 100%;
`;

const SectionWrapper = styled.section`
  ${homePadding}
`;

const SectionTitle = styled.div`
  ${textH3}
  margin-top: 16px;
  margin-bottom: 24px;
`;

const ItemListCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

const LineBanner = styled.div`
  background-color: ${({ theme }) => theme.greyScale65};
  height: 200px;
  margin: 48px 0px;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  ${homePadding}
  align-items: center;
`;

const ItemListRow = styled.div``;

export default Home;
