import React, { useState, useEffect, useRef, useCallback } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import {
  TextH2B,
  TextB2R,
  TextH6B,
  TextH3B,
  TextH7B,
  TextB3R,
  TextH4B,
  TextB4R,
  TextH5B,
} from '@components/Shared/Text';
import Image from 'next/image';
import { Tag } from '@components/Shared/Tag';
import { getFormatPrice, SVGIcon } from '@utils/common';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewList } from '@components/Pages/Review';
import { MENU_DETAIL_INFORMATION, MENU_REVIEW_AND_FAQ, TAG_MAP } from '@constants/menu';
import Link from 'next/link';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch, useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import { menuSelector, SET_MENU_ITEM, INIT_MENU_ITEM } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { CouponSheet } from '@components/BottomSheet/CouponSheet';
import dynamic from 'next/dynamic';
import { DetailBottomInfo } from '@components/Pages/Detail';
import Carousel from '@components/Shared/Carousel';
import { useQuery } from 'react-query';
import { getMenuDetailApi, getMenuDetailReviewApi, getMenusApi } from '@api/menu';
import { getMenuDisplayPrice } from '@utils/menu';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import axios from 'axios';
import { Label } from '@components/Pages/Subscription/SubsCardItem';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { IMenus, Obj, IMenuDetails } from '@model/index';
import isEmpty from 'lodash-es/isEmpty';
import dayjs from 'dayjs';
import getCustomDate from '@utils/destination/getCustomDate';
import Badge from '@components/Item/Badge';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { SET_INFO } from '@store/menu';
import { PERIOD_NUMBER } from '@constants/subscription';
import MenuItem from '@components/Pages/Subscription/register/MenuItem';
import cloneDeep from 'lodash-es/cloneDeep';
import { getPromotionCodeApi } from '@api/promotion';
import { getBannersApi } from '@api/banner';
import { IMAGE_S3_URL } from '@constants/mock';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

const DetailBottomFAQ = dynamic(() => import('@components/Pages/Detail/DetailBottomFAQ'));
const DetailBottomReview = dynamic(() => import('@components/Pages/Detail/DetailBottomReview'));

interface IProps {
  menuId: number;
}

const MenuDetailPage = ({ menuId }: IProps) => {
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('/menu/[id]');
  const tabRef = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const HEADER_HEIGHT = 56;

  const { me } = useSelector(userForm);
  const { menuItem } = useSelector(menuSelector);

  let timer: any = null;

  const dispatch = useDispatch();

  const {
    data: menuDetail,
    error: menuError,
    isLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      const { data } = await getMenuDetailApi(Number(menuId)!);

      return data?.data;
    },

    {
      onSuccess: (data) => {
        dispatch(SET_MENU_ITEM(data));
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
      const params = { id: Number(menuId)!, page: 1, size: 10 };
      const { data } = await getMenuDetailReviewApi(params);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: coupons,
    isLoading: couponsLoading,
    error: couponError,
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
          alertMessage: '로그인 후 쿠폰 다운로드 가능합니다.',
          submitBtnText: '로그인 하기',
          closeBtnText: '취소',
          onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(location.pathname)}`),
        })
      );
    } else {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <CouponSheet coupons={coupons && coupons} />,
        })
      );
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
          top: offsetTop,
        });
      }
    }, 100);
  };

  const renderBottomContent = () => {
    switch (selectedTab) {
      case '/menu/detail/review': {
        if (isOpenSoon) {
          return;
        }
        return <DetailBottomReview reviews={reviews} isSticky={isSticky} menuId={menuDetail?.id} />;
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
      return <Badge message="일시품절" />;
    } else if (isOpenSoon) {
      return <Badge message={`${result?.checkIsBeforeThanLaunchAt!}시 오픈`} />;
    } else if (isReOpen) {
      return <Badge message="재오픈예정" />;
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
    return () => {
      dispatch(INIT_MENU_ITEM());
    };
  }, []);

  if (isLoading && bannerLoading) {
    <div>로딩</div>;
  }

  return (
    <Container>
      <ImgWrapper>
        <Carousel images={menuDetail?.thumbnail} setCountIndex={setCurrentImg} />
        <DailySaleNumber>{badgeRenderer()}</DailySaleNumber>
        <CountWrapper>
          <TextH6B color={theme.white}>{`${currentImg + 1} / ${menuDetail?.thumbnail.length}`}</TextH6B>
        </CountWrapper>
      </ImgWrapper>
      <Top>
        <MenuDetailWrapper>
          <MenuNameWrapper>
            <TextH2B padding={'0 0 8px 0'}>{menuDetail?.name}</TextH2B>
            <div className="tagBox">
              {menuDetail?.constitutionTag && menuDetail?.constitutionTag !== 'NONE' && (
                <Tag margin="0 4px 0 0">{TAG_MAP[menuDetail?.constitutionTag]}</Tag>
              )}
              {menuDetail?.subscriptionDeliveries?.map((item: string, index: number) => (
                <Label className={item} key={index}>
                  {DELIVERY_TYPE_MAP[item]}
                </Label>
              ))}
              {!menuDetail?.subscriptionPeriods?.includes('UNLIMITED') && <Tag margin="0 4px 0 0">단기구독전용</Tag>}
            </div>
          </MenuNameWrapper>
          <TextB2R padding="16px 0" color={theme.greyScale65}>
            {menuDetail?.summary}
          </TextB2R>
          <PriceAndCouponWrapper>
            {!isOpenSoon && !isReOpen && (
              <PriceWrapper>
                <OriginPrice>
                  <TextH6B color={theme.greyScale25} textDecoration=" line-through">
                    {getFormatPrice(String(getMenuDetailPrice().price))}원
                  </TextH6B>
                </OriginPrice>
                <DiscountedPrice>
                  <TextH3B color={theme.brandColor}>{getMenuDetailPrice().discount}%</TextH3B>
                  <TextH3B padding={'0 0 0 4px'}>
                    {getFormatPrice(String(getMenuDetailPrice().discountedPrice))}원
                    {menuDetail?.type === 'SUBSCRIPTION' && '~'}
                  </TextH3B>
                </DiscountedPrice>
              </PriceWrapper>
            )}

            {!isTempSold && !isReOpen && !isOpenSoon && (
              <>
                {coupons?.some((coupon) => coupon.participationStatus === 'POSSIBLE') ? (
                  <CouponWrapper onClick={couponDownloadHandler}>
                    <TextH6B padding="4px 4px 0 0" pointer>
                      쿠폰 받기
                    </TextH6B>
                    <SVGIcon name="download" />
                  </CouponWrapper>
                ) : (
                  <CouponWrapper onClick={couponDownloadHandler}>
                    <TextH6B padding="4px 4px 0 0">다운 완료</TextH6B>
                    <SVGIcon name="checkBlack18" />
                  </CouponWrapper>
                )}
              </>
            )}
          </PriceAndCouponWrapper>
          {/* <BorderLine height={1} margin="16px 0 0 0" /> */}
          {menuDetail?.type !== 'SUBSCRIPTION' && menuDetail?.type === 'SALAD' && (
            <NutritionInfo>
              <NutritionInfoWrapper>
                <TextH7B color={theme.greyScale65}>영양정보</TextH7B>
                <NutritionInfoBox>
                  <TextH4B>{getNutiritionInfo().kcal}</TextH4B>
                  <TextB3R padding="0 0 0 2px">kcal</TextB3R>
                </NutritionInfoBox>
                {/* <MLWrapper></MLWrapper> */}
              </NutritionInfoWrapper>
              <ProteinWrapper>
                <TextH7B color={theme.greyScale65}>단백질 함량</TextH7B>
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
              <TextH5B padding="16px 0">배송 안내</TextH5B>
              <DeliveryUl>
                <DeliveryLi>
                  <TextB2R>배송 정보</TextB2R>
                  <TextB2R>
                    {menuDetail?.subscriptionDeliveries?.map((item: any) => DELIVERY_TYPE_MAP[item]).join('·')} / 주{' '}
                    {PERIOD_NUMBER[menuDetail?.subscriptionDeliveryCycle!]}회 배송
                  </TextB2R>
                </DeliveryLi>
                <DeliveryLi>
                  <TextB2R>상품 구성</TextB2R>
                  <TextB2R>{menuDetail?.subscriptionDescription}</TextB2R>
                </DeliveryLi>
              </DeliveryUl>
            </DeliveryInfoBox>
          )}
        </MenuDetailWrapper>
        {reviews?.searchReviewImages?.length! > 0 && !isTempSold && !isReOpen ? (
          <ReviewContainer>
            <ReviewWrapper>
              <ReviewHeader>
                <TextH4B padding="0 0 16px 0">베스트 후기</TextH4B>
                <TextH6B
                  textDecoration="underline"
                  color={theme.greyScale65}
                  padding="0 24px 0 0"
                  onClick={goToReviewSection}
                  pointer
                >
                  더보기
                </TextH6B>
              </ReviewHeader>
              <ReviewList reviews={reviews} onClick={goToReviewDetail} />
            </ReviewWrapper>
          </ReviewContainer>
        ) : (
          <BorderLine height={1} margin="0 auto" width={'calc(100% - 48px)'} />
        )}
        <DetailInfoContainer>
          {MENU_DETAIL_INFORMATION.map((info, index) => (
            <div key={index}>
              <DetailInfoWrapper>
                <TextH4B>{info.text}</TextH4B>
                <Link href={`${menuDetail?.id!}/detail/${info.value}`} passHref>
                  <a>
                    <TextH6B textDecoration="underLine" color={theme.greyScale65}>
                      자세히
                    </TextH6B>
                  </a>
                </Link>
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
                <BannerImg src={IMAGE_S3_URL + banner.imageUrl} />
              </AdWrapper>
            );
          })}
        </>
      )}

      <div ref={tabRef} />
      <Bottom>
        <StickyTab
          tabList={MENU_REVIEW_AND_FAQ}
          countObj={{ 후기: reviews?.searchReviews.length }}
          isSticky={isSticky}
          selectedTab={selectedTab}
          onClick={selectTabHandler}
        />
        <BottomContent>{renderBottomContent()}</BottomContent>
      </Bottom>
    </Container>
  );
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

const MLWrapper = styled.div`
  display: flex;
  color: ${theme.greyScale45};
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: -0.4px;
`;

const ProteinWrapper = styled.div``;

const CountWrapper = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 4px 8px;
  border-radius: 50%;
  background: ${theme.greyScale65};
  border-radius: 24px;
`;

const ReviewContainer = styled.div`
  background-color: ${theme.greyScale3};
`;

const AdWrapper = styled.div`
  width: 100%;
  height: 96px;
  /* background-color: #dedede; */
  margin-bottom: 16px;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
`;

const ReviewWrapper = styled.div`
  padding: 24px 0 24px 24px;
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
  const params = {
    menuSort: '',
  };

  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus`, { params });
  const paths = data.data.map((menu: any) => ({
    params: { menuId: menu.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { menuId: string } }) {
  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus/${params.menuId}`);

  return {
    props: { menuId: data.data.id },
    revalidate: 10,
  };
}

export default React.memo(MenuDetailPage);
