import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Banner from '@components/Banner';
import MainTab from '@components/Home/MainTab';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { Item, HorizontalItem } from '@components/Item';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { filterSelector } from '@store/filter';
import Image from 'next/image';
import BorderLine from '@components/Shared/BorderLine';
import { useRouter } from 'next/router';
import { SET_EVENT_TITLE , INIT_EVENT_TITLE} from '@store/event';
import { getExhibitionMdRecommendApi, getMainPromotionContentsApi } from '@api/promotion';
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

  console.log(mainContents);

  const renderExhibition = () => {
    
  };

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

  if (isLoadingMdMenu) {
    return <div>로딩</div>;
  };

  return (
    <Container>
      <Banner bannerList={bannerList} />
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
        mainContents?.map((item, idx) => {
          // <MainContentsWrapper key={idx}>
          if (item.type === "BANNER") {
            return (
              <PromotionBanner onClick={goToPromotion}> 
                <Image
                  src={`${process.env.IMAGE_S3_URL}${item.banner?.image?.url}`}
                  height="120px"
                  width="512px"
                  layout="responsive"
                  alt="홈 배너"
                />
              </PromotionBanner>
            )
          } else if (item.type === "EXHIBITION") {
            if(item.exhibition.type !== "MD_RECOMMENDED") {
              return (
                <PromotionWrapper>
                  {/* <FlexSpace>
                    <SectionTitle>{item.exhibition.title}</SectionTitle>
                    <TextH5B 
                      onClick={goToPromotion}
                      color={theme.greyScale65} 
                      textDecoration='underline' 
                      pointer
                    >더보기</TextH5B>
                  </FlexSpace>
                  <Image
                    src={`${process.env.IMAGE_S3_URL}/banner/img_home_contents_event.png`}
                    height="300px"
                    width="512px"
                    layout="responsive"
                    alt="메인 콘텐츠 기획전"
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
                  </ItemListRowWrapper> */}
                </PromotionWrapper>
              )
            }
          }
      // </MainContentsWrapper>
        })
        
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
