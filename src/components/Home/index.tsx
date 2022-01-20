import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Banner from '@components/Banner';
import MainTab from '@components/Home/MainTab';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextB3R } from '@components/Shared/Text';
import axios from 'axios';
import { Item, HorizontalItem } from '@components/Item';
import { useDispatch } from 'react-redux';
import { SET_MENU } from '@store/menu';
import { BASE_URL } from '@constants/mock';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';

/* TODO: Banner api type만 다른데 여러 번 호출함 -> 리팩토링 필요 */

const Home = () => {
  const [itemList, setItemList] = useState([]);
  const [bannerList, setBannerList] = useState<IBanners[]>([]);
  const [eventbannerList, setEventBannerList] = useState<IBanners[]>([]);

  const dispatch = useDispatch();

  const getItemLists = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
    dispatch(SET_MENU(data));
  };

  const getCarouselBanners = async () => {
    const params = {
      type: 'CAROUSEL',
    };
    try {
      const { data } = await getBannersApi(params);
      if (data.code === 200) {
        setBannerList(data.data);
      }
    } catch (error) {}
  };

  const getEventBanners = async () => {
    const params = {
      type: 'EVENT',
    };
    try {
      const { data } = await getBannersApi(params);
      if (data.code === 200) {
        setEventBannerList(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCarouselBanners();
    getEventBanners();
    getItemLists();
  }, []);

  return (
    <Container>
      <Banner bannerList={bannerList} />
      <SectionWrapper>
        <MainTab />
        <SectionTitle>MD 추천</SectionTitle>
        <FlexWrapWrapper>
          {itemList.map((item, index) => {
            return <Item item={item} key={index} />;
          })}
        </FlexWrapWrapper>
      </SectionWrapper>
      <LineBanner />
      <FlexSpace>
        <SectionTitle>이벤트 / 기획전 타이틀</SectionTitle>
        <TextB3R color={theme.greyScale65}>더보기</TextB3R>
      </FlexSpace>
      <Banner bannerList={eventbannerList} />
      <ItemListRowWrapper>
        <ItemListRow>
          {itemList.map((item, index) => {
            return <HorizontalItem item={item} key={index} />;
          })}
        </ItemListRow>
      </ItemListRowWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const SectionWrapper = styled.section`
  ${homePadding}
  width: 100%;
`;

const SectionTitle = styled.div`
  ${textH3}
  margin-top: 16px;
  margin-bottom: 24px;
`;

export const ItemListCol = styled.div`
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

const ItemListRowWrapper = styled.div`
  padding: 16px 0px 16px 16px;
  width: auto;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 48px;
`;

export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  > div {
    padding-right: 10px;
    width: 194px;
  }
`;

export default Home;
