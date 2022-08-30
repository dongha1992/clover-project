import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainTab from '@components/Home/MainTab';
import { textH3, homePadding, theme, FlexWrapWrapper } from '@styles/theme';
import { TextH5B, TextH3B } from '@components/Shared/Text';
import { Item } from '@components/Item';
import { useDispatch } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import Image from '@components/Shared/Image';
import BorderLine from '@components/Shared/BorderLine';
import { useRouter } from 'next/router';
import { getMainPromotionContentsApi } from '@api/promotion';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';
import Carousel from '@components/Shared/Carousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { IMenus } from '@model/index';

const Home = () => {
  const [bannerList, setBannerList] = useState<IBanners[]>([]);
  const [mainContents, setMainContents] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(INIT_EVENT_TITLE());
  });

  const { error: carouselError } = useQuery(
    'carouselBanners',
    async () => {
      const params = { type: 'CAROUSEL', size: 100 };
      const { data } = await getBannersApi(params);
      setBannerList(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const {
    data: contents,
    error: exhiError,
    isLoading: isLoadingExhibition,
  } = useQuery(
    ['getExhibitionMenus'],
    async () => {
      const { data } = await getMainPromotionContentsApi();
      setMainContents(data.data.mainContents);
      return data.data.mainContents.find((i) => i.exhibition?.type === 'MD_RECOMMENDED')?.exhibition.menus;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const goToPromotion = (id: number, title: string) => {
    dispatch(SET_EVENT_TITLE(title ? title : '기획전'));
    router.push(`/promotion/detail/${id}`);
  };

  if (isLoadingExhibition) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Container>
        <Carousel height="384px" autoPlay images={bannerList.map((banner) => ({ src: banner.image.url }))} />
      </Container>
      <SectionWrapper>
        <MainTab />
        <BorderLine height={1} margin="24px 0 24px 0" />
      </SectionWrapper>
      {mainContents?.length! > 0
        ? mainContents?.map((item: any, idx: number) => {
            if (item?.type === 'EXHIBITION') {
              if (item?.exhibition.type === 'MD_RECOMMENDED') {
                return (
                  <PromotionWrapper key={idx}>
                    <FlexSpace>
                      <TextH3B>{item?.exhibition.title}</TextH3B>
                      <TextH5B
                        onClick={() => goToPromotion(item?.exhibition.id, item?.exhibition.title)}
                        color={theme.greyScale65}
                        textDecoration="underline"
                        pointer
                      >
                        더보기
                      </TextH5B>
                    </FlexSpace>
                    <SectionWrapper>
                      <FlexWrapWrapper>
                        {contents?.length! > 0
                          ? contents?.map((item: IMenus, index: number) => {
                              if (index > 3) return;
                              return <Item item={item} key={index} />;
                            })
                          : '상품을 준비 중입니다.'}
                      </FlexWrapWrapper>
                    </SectionWrapper>
                  </PromotionWrapper>
                );
              } else if (item?.exhibition.type === 'GENERAL_MENU') {
                return (
                  <PromotionWrapper key={idx}>
                    <FlexSpace>
                      <TextH3B>{item?.exhibition.title}</TextH3B>
                      <TextH5B
                        onClick={() => goToPromotion(item?.exhibition.id, item?.exhibition.title)}
                        color={theme.greyScale65}
                        textDecoration="underline"
                        pointer
                      >
                        더보기
                      </TextH5B>
                    </FlexSpace>
                    <Image
                      src={item?.exhibition?.image.url}
                      height="287px"
                      width="512px"
                      layout="responsive"
                      alt="홈 기획전 이미지"
                    />
                    <SliderWrapper slidesPerView={'auto'} spaceBetween={25} speed={500}>
                      {item?.exhibition.menus?.map((item: IMenus, index: number) => {
                        if (index > 9) return;
                        return (
                          <SwiperSlide className="swiper-slide" key={index}>
                            <Item item={item} isHorizontal />
                          </SwiperSlide>
                        );
                      })}
                    </SliderWrapper>
                  </PromotionWrapper>
                );
              }
            } else if (item?.type === 'BANNER') {
              return (
                <PromotionBanner key={idx} onClick={() => goToPromotion(item.banner.id, item.banner.title)}>
                  <Image
                    src={item?.banner?.image.url}
                    height="131px"
                    width="512px"
                    layout="responsive"
                    alt="홈 배너형 기획전 이미지"
                  />
                </PromotionBanner>
              );
            }
          })
        : null}
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

const PromotionBanner = styled.section`
  max-width: 512px;
  width: 100%;
  padding: 24px 0px;
  cursor: pointer;
`;

const PromotionWrapper = styled.section`
  width: 100%;
  padding: 24px 0;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 24px 24px 24px;
`;

const SliderWrapper = styled(Swiper)`
  width: auto;
  padding: 24px 24px 0 24px;
  .swiper-slide {
    width: 120px;
  }
`;

export default Home;
