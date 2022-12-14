import React, { useState, useEffect, useRef, useCallback, ReactElement } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH2B, TextB2R, TextH6B, TextH3B, TextH7B, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { getFormatPrice, SVGIcon } from '@utils/common';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewItem } from '@components/Pages/Review';
import { MENU_DETAIL_INFORMATION, MENU_REVIEW_AND_FAQ, TAG_MAP } from '@constants/menu';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch, useSelector } from 'react-redux';
import { menuSelector, SET_MENU_ITEM, INIT_MENU_ITEM, SET_REVIEW_IMAGES_COUNT } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { CouponSheet } from '@components/BottomSheet/CouponSheet';
import dynamic from 'next/dynamic';
import { DetailBottomInfo } from '@components/Pages/Detail';
import Carousel, { ICarouselImageProps } from '@components/Shared/Carousel';
import Image from '@components/Shared/Image';
import { useQuery } from 'react-query';
import { getMenuDetailApi, getMenuDetailReviewApi, getMenuDetailReviewImageApi, getBestReviewApi } from '@api/menu';
import { getMenuDisplayPrice } from '@utils/menu';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Label } from '@components/Pages/Subscription/SubsCardItem';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { Obj } from '@model/index';
import isEmpty from 'lodash-es/isEmpty';
import dayjs from 'dayjs';
import Badge from '@components/Item/Badge';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { SET_INFO } from '@store/menu';
import { PERIOD_NUMBER } from '@constants/subscription';
import cloneDeep from 'lodash-es/cloneDeep';
import { getPromotionCodeApi } from '@api/promotion';
import { getBannersApi } from '@api/banner';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { NextPageWithLayout } from '@pages/_app';
import DefaultLayout from '@components/Layout/Default';
import DetailBottom from '@components/Bottom/DetailBottom';
import { show, hide } from '@store/loading';
import { Loading } from '@components/Shared/Loading';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

const DetailBottomFAQ = dynamic(() => import('@components/Pages/Detail/DetailBottomFAQ'));
const DetailBottomReview = dynamic(() => import('@components/Pages/Detail/DetailBottomReview'));

const MenuDetailPage: NextPageWithLayout = () => {
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('/menu/[id]');
  const [thumbnailList, setThumbnailList] = useState<ICarouselImageProps[]>([]);
  const tabRef = useRef<HTMLDivElement>(null);

  const HEADER_HEIGHT = 56;

  const { me } = useSelector(userForm);
  const { menuItem } = useSelector(menuSelector);

  let timer: any = null;

  const dispatch = useDispatch();
  const router = useRouter();
  const menuId = Number(router.query.menuId);

  const {
    data: menuDetail,
    error: menuError,
    isLoading: isLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      dispatch(show());
      const { data } = await getMenuDetailApi(Number(menuId)!);
      setThumbnailList(data.data.thumbnail.map((image) => ({ src: image.url })));
      return data?.data;
    },

    {
      onSuccess: (data) => {
        dispatch(SET_MENU_ITEM(data));
      },
      onSettled: () => {
        // dispatch(hide());
      },

      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  let result = menuDetail && checkMenuStatus(menuDetail)!;

  const isTempSold = result?.isItemSold && !menuDetail?.isReopen;
  const isOpenSoon = !result?.isItemSold && menuDetail?.isReopen && result?.checkIsBeforeThanLaunchAt?.length! > 0;
  const isReOpen = result?.isItemSold && menuDetail?.isReopen;

  const { data: reviews, error } = useQuery(
    'getMenuDetailReview',
    async () => {
      dispatch(show());
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      onSettled: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: bestReviews,
    error: bestReviewsError,
    isLoading: bestReviewLoading,
  } = useQuery(
    'getBestReviewApi',
    async () => {
      dispatch(show());
      const params = { id: Number(menuId)!, page: 1, size: 10 };

      const { data } = await getBestReviewApi(params);
      return data.data.menuReviews;
    },

    {
      onSuccess: (data) => {},
      onSettled: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: reviewsImages,
    error: reviewsImagesError,
    isLoading: reviewImagesLoading,
  } = useQuery(
    'getMenuDetailReviewImages',
    async () => {
      dispatch(show());
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewImageApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {
        dispatch(SET_REVIEW_IMAGES_COUNT(data.pagination.total));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuId,
    }
  );

  const {
    data: coupons,
    isLoading: couponsLoading,
    error: couponError,
    refetch,
  } = useQuery(
    'getPromotion',
    async () => {
      const params = {
        type: 'MENU',
      };
      const { data } = await getPromotionCodeApi(params);
      return data.data.promotions;
    },

    {
      onSuccess: (data) => {},
      enabled: !!me,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: banners,
    isLoading: bannerLoading,
    error: bannerError,
  } = useQuery(
    'menuBanners',
    async () => {
      const params = { type: 'MENU', size: 2 };
      const { data } = await getBannersApi(params);
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const onScrollHandler = (e: any) => {
    const offset = tabRef?.current?.offsetTop;
    const scrollTop = e?.srcElement.scrollingElement.scrollTop;
    if (offset) {
      if (scrollTop + HEADER_HEIGHT > offset) {
        setIsStikcy(true);
      } else {
        setIsStikcy(false);
      }
    }
  };

  const couponDownloadHandler = () => {
    if (!me) {
      dispatch(
        SET_ALERT({
          alertMessage: '???????????? ????????? ???????????????.\n????????? ????????????????',
          submitBtnText: '??????',
          closeBtnText: '??????',
          onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(location.pathname)}`),
        })
      );
    } else {
      refetch().then((res) => {
        if (!res.isLoading) {
          const data = res.data;
          dispatch(
            SET_BOTTOM_SHEET({
              content: <CouponSheet coupons={data} />,
            })
          );
        }
      });
    }
  };

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },
    [selectedTab]
  );

  const goToReviewDetail = (review: any) => {
    router.push(`/menu/${menuDetail?.id!}/review/${review.id}`);
  };

  const goToReviewSection = () => {
    setSelectedTab(() => '/menu/detail/review');
    timer = setTimeout(() => {
      if (tabRef.current) {
        const offsetTop = tabRef?.current?.offsetTop;
        window.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: offsetTop - 70,
        });
      }
    }, 100);
  };

  const renderBottomContent = () => {
    const isSub = menuDetail?.type === 'SUBSCRIPTION';

    switch (selectedTab) {
      case '/menu/detail/review': {
        if (isOpenSoon) {
          return;
        }
        return (
          <DetailBottomReview
            reviews={reviews!}
            isSticky={isSticky}
            menuId={menuDetail?.id!}
            reviewsImages={reviewsImages!}
            isSub={isSub}
          />
        );
      }

      case '/menu/detail/faq':
        return <DetailBottomFAQ menuFaq={menuDetail?.menuFaq!} />;
      default:
        return <DetailBottomInfo menuDescription={menuDetail?.description!} />;
    }
  };

  const getMenuDetailPrice = () => {
    const { discount, price, discountedPrice } = getMenuDisplayPrice(menuDetail?.menuDetails ?? [{}]);
    return { discount, price, discountedPrice };
  };

  const badgeRenderer = () => {
    const badgeMap: Obj = {
      NEW: 'New',
      BEST: 'Best',
    };

    if (isTempSold) {
      return <Badge message="????????????" />;
    } else if (isOpenSoon) {
      return <Badge message={`${result?.checkIsBeforeThanLaunchAt!}??? ??????`} />;
    } else if (isReOpen) {
      return <Badge message="???????????????" />;
    } else if (!menuDetail?.isReopen && menuDetail?.badgeMessage) {
      return <Badge message={badgeMap[menuDetail?.badgeMessage]} />;
    } else {
      return;
    }
  };

  const getNutiritionInfo = () => {
    const copied = cloneDeep(menuDetail);
    const sorted = copied?.menuDetails?.sort((a, b) => a.price - b.price)!;
    const lowerPriceDetail = sorted[0];
    return { kcal: lowerPriceDetail.calorie || 0, protein: lowerPriceDetail.protein || 0 };
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      clearTimeout(timer);
    };
  }, [tabRef?.current?.offsetTop]);

  useEffect(() => {
    dispatch(SET_INFO(menuDetail!));
    if (isEmpty(menuItem)) {
      dispatch(SET_MENU_ITEM(menuDetail));
    }
  }, [menuDetail]);

  useEffect(() => {
    if (router.isReady) {
      setSelectedTab(router.query.tab ? '/menu/detail/review' : '/menu/[id]');
    }
  }, [router.isReady]);

  useEffect(() => {
    return () => {
      dispatch(INIT_MENU_ITEM());
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !bannerLoading && !bestReviewLoading && !reviewImagesLoading) {
      dispatch(hide());
    }
  }, [bannerLoading, bestReviewLoading, dispatch, isLoading, reviewImagesLoading]);

  return (
    <Container>
      <ImgWrapper>
        <Carousel images={thumbnailList} />
        <DailySaleNumber>{badgeRenderer()}</DailySaleNumber>
      </ImgWrapper>
      <Top>
        <MenuDetailWrapper>
          <MenuNameWrapper>
            <TextH2B padding={'0 0 8px 0'}>{menuDetail?.name}</TextH2B>
            <div className="tagBox">
              {menuDetail?.type !== 'SUBSCRIPTION' &&
                menuDetail?.constitutionTag &&
                menuDetail?.constitutionTag !== 'NONE' && (
                  <Tag margin="0 4px 0 0">{TAG_MAP[menuDetail?.constitutionTag]}</Tag>
                )}
              {menuDetail?.subscriptionDeliveries?.map((item: string, index: number) => (
                <Label className={item} key={index}>
                  {DELIVERY_TYPE_MAP[item]}
                </Label>
              ))}
              {menuDetail?.type === 'SUBSCRIPTION' && !menuDetail?.subscriptionPeriods?.includes('UNLIMITED') && (
                <Tag margin="0 4px 0 0">??????????????????</Tag>
              )}
            </div>
          </MenuNameWrapper>
          <TextB2R padding="16px 0" color={theme.greyScale65}>
            {menuDetail?.summary}
          </TextB2R>
          <PriceAndCouponWrapper>
            {!isOpenSoon && !isReOpen && (
              <PriceWrapper>
                {!isTempSold && (
                  <OriginPrice>
                    <TextH6B color={theme.greyScale25} textDecoration=" line-through">
                      {getFormatPrice(String(getMenuDetailPrice().price))}???
                    </TextH6B>
                  </OriginPrice>
                )}
                <DiscountedPrice>
                  {getMenuDetailPrice().discount > 0 && !isTempSold && menuDetail?.type !== 'SUBSCRIPTION' && (
                    <TextH3B padding={'0 4px 0 0px'} color={theme.brandColor}>
                      {getMenuDetailPrice().discount}%
                    </TextH3B>
                  )}
                  <TextH3B>
                    {getFormatPrice(String(getMenuDetailPrice().discountedPrice))}???
                    {menuDetail?.type === 'SUBSCRIPTION' && '~'}
                  </TextH3B>
                </DiscountedPrice>
              </PriceWrapper>
            )}
            {!isTempSold && !isReOpen && !isOpenSoon && (
              <>
                {coupons?.some((coupon) => coupon.participationStatus === 'POSSIBLE') ? (
                  <CouponWrapper onClick={couponDownloadHandler}>
                    <TextH6B padding="0px 4px 0 0" pointer>
                      ?????? ??????
                    </TextH6B>
                    <SVGIcon name="download" />
                  </CouponWrapper>
                ) : (
                  <CouponWrapper onClick={couponDownloadHandler}>
                    <TextH6B padding="4px 4px 0 0">{!me ? '?????? ??????' : '?????? ??????'}</TextH6B>
                    <SVGIcon name="checkBlack18" />
                  </CouponWrapper>
                )}
              </>
            )}
          </PriceAndCouponWrapper>

          {menuDetail?.type !== 'SUBSCRIPTION' && menuDetail?.type === 'SALAD' && (
            <NutritionInfo>
              <NutritionInfoWrapper>
                <TextH7B color={theme.greyScale65}>????????????</TextH7B>
                <NutritionInfoBox>
                  <TextH4B>{getNutiritionInfo().kcal}</TextH4B>
                  <TextB3R padding="0 0 0 2px">kcal</TextB3R>
                </NutritionInfoBox>
                {/* <MLWrapper></MLWrapper> */}
              </NutritionInfoWrapper>
              <ProteinWrapper>
                <TextH7B color={theme.greyScale65}>????????? ??????</TextH7B>
                <NutritionInfoBox>
                  <TextH4B>{getNutiritionInfo().protein}</TextH4B>
                  <TextB3R padding="0 0 0 2px">kcal</TextB3R>
                </NutritionInfoBox>
                {/* <MLWrapper></MLWrapper> */}
              </ProteinWrapper>
            </NutritionInfo>
          )}
          {menuDetail?.type === 'SUBSCRIPTION' && (
            <DeliveryInfoBox>
              <TextH5B padding="16px 0">?????? ??????</TextH5B>
              <DeliveryUl>
                <DeliveryLi>
                  <TextB2R>?????? ??????</TextB2R>
                  <TextB2R>
                    {menuDetail?.subscriptionDeliveries?.map((item: any) => DELIVERY_TYPE_MAP[item]).join('??')} / ???{' '}
                    {PERIOD_NUMBER[menuDetail?.subscriptionDeliveryCycle!]}??? ??????
                  </TextB2R>
                </DeliveryLi>
                <DeliveryLi>
                  <TextB2R>?????? ??????</TextB2R>
                  <TextB2R>{menuDetail?.subscriptionDescription}</TextB2R>
                </DeliveryLi>
              </DeliveryUl>
            </DeliveryInfoBox>
          )}
        </MenuDetailWrapper>
        {bestReviews?.length! > 0 && !isTempSold && !isReOpen ? (
          <ReviewContainer>
            <ReviewHeader>
              <TextH4B padding="0 0 16px 0">????????? ??????</TextH4B>
              <TextH6B
                textDecoration="underline"
                color={theme.greyScale65}
                padding="0 24px 0 0"
                onClick={goToReviewSection}
                pointer
              >
                ?????????
              </TextH6B>
            </ReviewHeader>
            <ReviewSwipeContainer className="swiper-container" slidesPerView={'auto'} spaceBetween={15} speed={500}>
              {bestReviews?.map((review: any, index: number) => {
                if (index > 3) return;
                return (
                  <SwiperSlide className="swiper-slide" key={index}>
                    <ReviewItem review={review!} key={index} onClick={() => goToReviewDetail(review)} />{' '}
                  </SwiperSlide>
                );
              })}
            </ReviewSwipeContainer>
          </ReviewContainer>
        ) : (
          <BorderLine height={1} margin="0 auto" width={'calc(100% - 48px)'} />
        )}
        <DetailInfoContainer>
          {MENU_DETAIL_INFORMATION.map((info, index) => (
            <div key={index}>
              <DetailInfoWrapper onClick={() => router.replace(`${menuDetail?.id!}/detail/${info.value}`)}>
                <TextH4B>{info.text}</TextH4B>
                <TextH6B textDecoration="underLine" color={theme.greyScale65}>
                  ?????????
                </TextH6B>
              </DetailInfoWrapper>
              {index !== MENU_DETAIL_INFORMATION.length - 1 ? <BorderLine height={1} margin="16px 0" /> : null}
            </div>
          ))}
        </DetailInfoContainer>
      </Top>
      {banners?.length! > 0 && (
        <>
          {banners?.map((banner, index) => {
            return (
              <AdWrapper key={index}>
                <Image
                  src={banner.image.url}
                  width="512px"
                  height="131px"
                  layout="responsive"
                  alt="?????? ?????? ????????? ??????"
                />
              </AdWrapper>
            );
          })}
        </>
      )}
      <div ref={tabRef} />
      <Bottom>
        <StickyTab
          tabList={MENU_REVIEW_AND_FAQ}
          countObj={{ ??????: menuDetail?.reviewCount }}
          isSticky={isSticky}
          selectedTab={selectedTab}
          onClick={selectTabHandler}
        />
        <BottomContent>{renderBottomContent()}</BottomContent>
      </Bottom>
    </Container>
  );
};

MenuDetailPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout bottom={<DetailBottom />}>{page}</DefaultLayout>;
};

const Container = styled.section``;

const ImgWrapper = styled.div`
  position: relative;
`;

const Top = styled.div``;

const MenuDetailWrapper = styled.div`
  padding: 24px;
`;

const MenuNameWrapper = styled.div`
  padding: 0 0 16px 0;
  .tagBox {
    display: flex;
  }
`;

const PriceAndCouponWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CouponWrapper = styled.div`
  border: 1px solid #242424;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px 10px 16px;
  cursor: pointer;
`;

const OriginPrice = styled.div``;

const DiscountedPrice = styled.div`
  display: flex;
  align-items: center;
`;

const NutritionInfo = styled.div`
  padding-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const NutritionInfoWrapper = styled.div``;

const NutritionInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const DeliveryInfoBox = styled.div`
  border-top: 1px solid ${theme.greyScale6};
  margin-top: 24px;
`;
const DeliveryUl = styled.ul``;
const DeliveryLi = styled.li`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  &:last-of-type {
    padding-bottom: 0;
  }
`;

const ProteinWrapper = styled.div``;

const ReviewContainer = styled.div`
  background-color: ${theme.greyScale3};
  padding: 24px;
`;

const ReviewSwipeContainer = styled(Swiper)`
  width: 100%;

  cursor: pointer;
  .swiper-slide {
    max-width: 488px;
    width: 100%;
  }
`;

const AdWrapper = styled.div`
  width: 100%;
  padding-bottom: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DetailInfoContainer = styled.div`
  padding: 24px;
`;

const DetailInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Bottom = styled.div``;

const BottomContent = styled.div``;

const DailySaleNumber = styled.div`
  position: absolute;
  left: 0px;
  top: 10px;
  width: 100%;
`;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default MenuDetailPage;
