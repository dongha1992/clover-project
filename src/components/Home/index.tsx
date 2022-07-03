import React, { useState } from 'react';
import styled from 'styled-components';
import Banner from '@components/Banner';
import MainTab from '@components/Home/MainTab';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextB3R } from '@components/Shared/Text';
import { Item, HorizontalItem } from '@components/Item';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { getMenusApi, getRecommendMenusApi } from '@api/menu';
import { filterSelector } from '@store/filter';
import Image from 'next/image';
/* TODO: Banner api type만 다른데 여러 번 호출함 -> 리팩토링 필요 */
/* TODO: static props로  */

const Home = () => {
  const [bannerList, setBannerList] = useState<IBanners[]>([]);
  const [eventbannerList, setEventBannerList] = useState<IBanners[]>([]);

  const { type } = useSelector(filterSelector);
  const dispatch = useDispatch();

  const { error: carouselError } = useQuery(
    'carouselBanners',
    async () => {
      const params = { type: 'CAROUSEL', size: 100 };
      const { data } = await getBannersApi(params);
      setBannerList(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { error: eventsError } = useQuery(
    'eventsBanners',
    async () => {
      const params = { type: 'EVENT', size: 100 };
      const { data } = await getBannersApi(params);
      setEventBannerList(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getRecommendMenusApi();
      return data.data.sort((a: any, b: any) => a.isSold - b.isSold);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Banner bannerList={bannerList} />
      <SectionWrapper>
        <MainTab />
        <SectionTitle>MD 추천</SectionTitle>
        <FlexWrapWrapper>
          {menus?.length! > 0
            ? menus?.map((item, index) => {
                if (index > 3) return;
                return <Item item={item} key={index} />;
              })
            : '상품을 준비 중입니다.'}
        </FlexWrapWrapper>
      </SectionWrapper>
      <LineBanner>
        <Image
          src={`${process.env.IMAGE_S3_URL}/banner/img_home_contents_banner.png`}
          height="120px"
          width="512px"
          layout="responsive"
        />
      </LineBanner>
      <FlexSpace>
        <SectionTitle>메인 콘텐츠 기획전 - 1</SectionTitle>
        <TextB3R color={theme.greyScale65}>더보기</TextB3R>
      </FlexSpace>
      <Image
        src={`${process.env.IMAGE_S3_URL}/banner/img_home_contents_event.png`}
        height="300px"
        width="512px"
        layout="responsive"
      />
      {eventbannerList.length !== 0 && <Banner bannerList={eventbannerList} />}
      <ItemListRowWrapper>
        <ItemListRow>
          {menus?.length! > 0
            ? menus?.map((item, index) => {
                if (index > 3) return;
                return <Item item={item} key={index} isHorizontal />;
              })
            : '상품을 준비 중입니다.'}
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
  margin-top: 24px;
  margin-bottom: 24px;
`;

export const ItemListCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

const LineBanner = styled.div`
  height: 96px;
  max-width: 512px;
  width: 100%;
  margin: 24px 0px;
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
  margin-bottom: 12px;
`;

export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  > div {
    padding-right: 10px;
    /* width: 194px; */
  }
`;

export default React.memo(Home);
