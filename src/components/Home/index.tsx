import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainTab from '@components/Home/MainTab';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { Item } from '@components/Item';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { getRecommendMenusApi } from '@api/menu';
import { filterSelector } from '@store/filter';
import Image from '@components/Shared/Image';
import BorderLine from '@components/Shared/BorderLine';
import { useRouter } from 'next/router';
import { SET_EVENT_TITLE , INIT_EVENT_TITLE } from '@store/event';
import Carousel from "@components/Shared/Carousel";
/* TODO: Banner api type만 다른데 여러 번 호출함 -> 리팩토링 필요 */

const Home = () => {
  const [bannerList, setBannerList] = useState<IBanners[]>([]);
  const [eventbannerList, setEventBannerList] = useState<IBanners[]>([]);

  const router = useRouter();
  const { type } = useSelector(filterSelector);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(INIT_EVENT_TITLE());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const goToMd = () => {
    router.push('/md');
  };

  const goToPromotion = () => {
    dispatch(SET_EVENT_TITLE('친구 초대하기러기토마토스위스역삼역'));
    router.push({
      pathname: '/promotion/detail',
      query: {
        id: 1,
        subs: false,
        edit_feed: true,
      },
    });
  };

  if (isLoading) {
    return <div>로딩</div>;
  };

  return (
    <Container>
        <Container>
            <Carousel images={bannerList.map(banner => ({ src: banner.image.url }))} />
        </Container>
      <SectionWrapper>
        <MainTab />
        <BorderLine height={1} margin="24px 0 24px 0" />
      </SectionWrapper>
      <FlexSpace>
        <SectionTitle>MD 추천</SectionTitle>
        <TextH5B 
          onClick={goToMd}
          color={theme.greyScale65} 
          textDecoration='underline' 
          pointer
        >더보기</TextH5B>
      </FlexSpace>
      <SectionWrapper>
        <FlexWrapWrapper>
          {menus?.length! > 0
            ? menus?.map((item, index) => {
                if (index > 3) return;
                return <Item item={item} key={index} />;
              })
            : '상품을 준비 중입니다.'}
        </FlexWrapWrapper>
      </SectionWrapper>
      <LineBanner onClick={goToPromotion}>
        <Image
          src="/banner/img_home_contents_banner.png"
          height="120px"
          width="512px"
          layout="responsive"
          alt="홈 배너"
        />
      </LineBanner>
      <PromotionWrapper>
        <FlexSpace>
          <SectionTitle>메인 콘텐츠 기획전 - 1</SectionTitle>
          <TextH5B 
            onClick={goToPromotion}
            color={theme.greyScale65} 
            textDecoration='underline' 
            pointer
          >더보기</TextH5B>
        </FlexSpace>
        <Image
          src="/banner/img_home_contents_event.png"
          height="300px"
          width="512px"
          layout="responsive"
          alt="메인 콘텐츠 기획전"
        />
        {eventbannerList.length !== 0 && <Carousel images={eventbannerList.map(banner => ({src: banner.image.url}))}></Carousel>}
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
      </PromotionWrapper>
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

const LineBanner = styled.section`
  height: 96px;
  max-width: 512px;
  width: 100%;
  margin: 24px 0px;
`;

const PromotionWrapper = styled.section`
  width: 100%;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  ${homePadding}
  align-items: center;
`;

const ItemListRowWrapper = styled.div`
  padding: 24px 0px 24px 24px;
  width: auto;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  //margin-bottom: 12px;
`;

export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  > div {
    padding-right: 16px;
  }
`;

export default React.memo(Home);
