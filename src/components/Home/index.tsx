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
import { getExhibitionMdRecommendApi, getMainPromotionContentsApi } from '@api/promotion';
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

  // MD 추천 api 호출
  const { 
    data: mdMenu,
    error: mdMenuError,
    isLoading: isLoadingMdMenu,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getExhibitionMdRecommendApi();
      return data.data.menus;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const {
    data: mainContents,
    error: exhiError,
    isLoading: isLoadingExhibition,
  } = useQuery(
    'exhibitionList',
    async () => {
      const { data } = await getMainPromotionContentsApi();
      return data.data.mainContents;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const renderExhibition = () => {
    
  };

  const goToMd = () => {
    router.push('/md');
  };

  const goToPromotion = (id: number, title: string) => {
    dispatch(SET_EVENT_TITLE(title ? title : '기획전'));
    router.push(`/promotion/detail/${id}`);
  };

  if (isLoadingMdMenu) {
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
          {mdMenu?.length! > 0
            ? mdMenu?.map((item: any, index: number) => {
                if (index > 3) return;
                return <Item item={item} key={index} />;
              })
            : '상품을 준비 중입니다.'}
        </FlexWrapWrapper>
      </SectionWrapper>
      {
        mainContents?.length! > 0
          ? mainContents?.map((item, iex) => {
            if(item.type === "BANNER") {
              return (
                <PromotionBanner key={iex} onClick={() => goToPromotion(item.banner.id, item.banner.title)}>
                  <Image
                    src={item.banner.image.url}
                    height="120px"
                    width="512px"
                    layout="responsive"
                    alt="홈 배너형 기획전 이미지"
                  />
                </PromotionBanner>
              )
            } else if (item.type === "EXHIBITION") {
              if(item.exhibition.type === "GENERAL_MENU") {
                return (
                  <PromotionWrapper key={iex}>
                    <FlexSpace>
                      <SectionTitle>{item.exhibition.title}</SectionTitle>
                      <TextH5B 
                        onClick={() => goToPromotion(item.exhibition.id, item.exhibition.title)}
                        color={theme.greyScale65} 
                        textDecoration='underline' 
                        pointer
                      >더보기</TextH5B>
                    </FlexSpace>
                    <Image
                      src={item.exhibition.image.url}
                      height="300px"
                      width="512px"
                      layout="responsive"
                      alt="홈 기획전 이미지"
                    />
                    <ItemListRowWrapper>
                      <ItemListRow>
                        {item.exhibition.menus?.length! > 0
                          ? item.exhibition.menus?.map((item, index) => {
                              if (index > 9) return;
                              return <Item item={item} key={index} isHorizontal />;
                            })
                          : '상품을 준비 중입니다.'}
                      </ItemListRow>
                    </ItemListRowWrapper>
                  </PromotionWrapper>
                )
              }
            }
          })
          : null
      }
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

const PromotionBanner = styled.section`
  height: 96px;
  max-width: 512px;
  width: 100%;
  margin: 24px 0px;
`;

const MainContentsWrapper = styled.div``;

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
