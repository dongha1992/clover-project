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
import { MENU_DETAIL_INFORMATION, MENU_REVIEW_AND_FAQ } from '@constants/menu';
import Link from 'next/link';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch, useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import { menuSelector, SET_MENU_ITEM } from '@store/menu';
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
import dayjs from 'dayjs';
import getCustomDate from '@utils/destination/getCustomDate';
import Badge from '@components/Item/Badge';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { PERIOD_NUMBER } from '@constants/subscription';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

const DetailBottomFAQ = dynamic(() => import('@components/Pages/Detail/DetailBottomFAQ'));
const DetailBottomReview = dynamic(() => import('@components/Pages/Detail/DetailBottomReview'));

/* TODO: 영양 정보 리팩토링 */
/* TODO: 영양 정보 샐러드만 보여줌 */
/* TODO: 베스트후기 없으면 안 보여줌  */

const hasAvailableCoupon = true;
interface IProps {
  menuDetail: IMenus;
}

const MenuDetailPage = ({ menuDetail }: IProps) => {
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('/menu/[id]');
  const tabRef = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const HEADER_HEIGHT = 56;

  const { me } = useSelector(userForm);
  let { isItemSold, checkIsBeforeThanLaunchAt } = checkMenuStatus(menuDetail);

  let timer: any = null;

  const dispatch = useDispatch();

  const { data: reviews, error } = useQuery(
    'getMenuDetailReview',
    async () => {
      const { data } = await getMenuDetailReviewApi(menuDetail.id);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
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
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CouponSheet />,
      })
    );
  };

  const selectTabHandler = useCallback(
    ({ link }: any) => {
      setSelectedTab(link);
    },
    [selectedTab]
  );

  const goToReviewDetail = (review: any) => {
    router.push(`/menu/${menuDetail.id}/review/${review.id}`);
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
      case '/menu/detail/review':
        return <DetailBottomReview reviews={reviews} isSticky={isSticky} menuId={menuDetail.id} />;
      case '/menu/detail/faq':
        return <DetailBottomFAQ />;
      default:
        return <DetailBottomInfo />;
    }
  };

  const getMenuDetailPrice = () => {
    const { discount, price, discountedPrice } = getMenuDisplayPrice(menuDetail.menuDetails ?? [{}]);
    return { discount, price, discountedPrice };
  };

  const badgeRenderer = () => {
    const badgeMap: Obj = {
      NEW: 'New',
      BEST: 'Best',
    };

    let { badgeMessage, isReopen, isSold } = menuDetail;

    if (isItemSold && !isReopen) {
      return <Badge message="일시품절" />;
    } else if (isItemSold && isReopen && checkIsBeforeThanLaunchAt.length > 0) {
      return <Badge message={`${checkIsBeforeThanLaunchAt}시 오픈`} />;
    } else if (!isReopen && badgeMessage) {
      return <Badge message={badgeMap[badgeMessage]} />;
    } else {
      return;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      clearTimeout(timer);
    };
  }, [tabRef?.current?.offsetTop]);

  useEffect(() => {
    return () => {};
  }, []);

  console.log(menuDetail, 'menuItem');

  return (
    <Container>
      <ImgWrapper>
        <Carousel images={menuDetail?.thumbnail} setCountIndex={setCurrentImg} />
        <DailySaleNumber>{badgeRenderer()}</DailySaleNumber>
        {/* <CountWrapper>
          <TextH6B color={theme.white}>{`${currentImg + 1} / ${data?.url.length}`}</TextH6B>
        </CountWrapper> */}
      </ImgWrapper>
      <Top>
        <MenuDetailWrapper>
          <MenuNameWrapper>
            <TextH2B padding={'0 0 8px 0'}>{menuDetail.name}</TextH2B>
            {menuDetail.constitutionTag && menuDetail.constitutionTag !== 'NONE' && (
              <Tag margin="0 4px 0 0">{menuDetail.constitutionTag}</Tag>
            )}
            <div className="tagBox">
              {menuDetail?.subscriptionDeliveries?.map((item: string, index: number) => (
                <Label className={item} key={index}>
                  {DELIVERY_TYPE_MAP[item]}
                </Label>
              ))}
              {!menuDetail?.subscriptionPeriods?.includes('UNLIMITED') && <Tag margin="0 4px 0 0">단기구독전용</Tag>}
              {menuDetail.constitutionTag && menuDetail.constitutionTag !== 'NONE' && (
                <Tag margin="0 4px 0 0">{menuDetail.constitutionTag}</Tag>
              )}
            </div>
          </MenuNameWrapper>
          <TextB2R padding="0 0 16px 0" color={theme.greyScale65}>
            {menuDetail.description}
          </TextB2R>
          <PriceAndCouponWrapper>
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
                  {menuDetail.type === 'SUBSCRIPTION' && '~'}
                </TextH3B>
              </DiscountedPrice>
            </PriceWrapper>
            {hasAvailableCoupon ? (
              <CouponWrapper onClick={couponDownloadHandler}>
                <TextH6B padding="4px 4px 0 0" pointer>
                  쿠폰 받기
                </TextH6B>
                <SVGIcon name="download" />
              </CouponWrapper>
            ) : (
              <CouponWrapper>
                <TextH6B padding="4px 4px 0 0">발급 완료</TextH6B>
                <SVGIcon name="checkBlack18" />
              </CouponWrapper>
            )}
          </PriceAndCouponWrapper>
          {menuDetail.type !== 'SUBSCRIPTION' && (
            <NutritionInfo>
              <NutritionInfoWrapper>
                <TextH7B color={theme.greyScale65}>영양정보</TextH7B>
                <NutritionInfoBox>
                  <TextH4B>123,233</TextH4B>
                  <TextB3R padding="0 0 0 2px">kcal</TextB3R>
                </NutritionInfoBox>
                <MLWrapper>
                  (<TextH7B padding="0 2px 0 0">M</TextH7B>
                  <TextB4R padding="0 2px 0 0">228g</TextB4R>/<TextH7B padding="0 2px 0 2px">L</TextH7B>
                  <TextB4R>324g</TextB4R>)
                </MLWrapper>
              </NutritionInfoWrapper>
              <ProteinWrapper>
                <TextH7B color={theme.greyScale65}>단백질 함량</TextH7B>
                <NutritionInfoBox>
                  <TextH4B>123,233</TextH4B>
                  <TextB3R padding="0 0 0 2px">kcal</TextB3R>
                </NutritionInfoBox>
                <MLWrapper>
                  (<TextH7B padding="0 2px 0 0">M</TextH7B>
                  <TextB4R padding="0 2px 0 0">228g</TextB4R>/<TextH7B padding="0 2px 0 2px">L</TextH7B>
                  <TextB4R>324g</TextB4R>)
                </MLWrapper>
              </ProteinWrapper>
            </NutritionInfo>
          )}
          {menuDetail.type === 'SUBSCRIPTION' && (
            <DeliveryInfoBox>
              <TextH5B padding="16px 0">배송 안내</TextH5B>
              <DeliveryUl>
                <DeliveryLi>
                  <TextB2R>배송 정보</TextB2R>
                  <TextB2R>
                    {menuDetail.subscriptionDeliveries.map((item: any) => DELIVERY_TYPE_MAP[item]).join('·')} / 주{' '}
                    {PERIOD_NUMBER[menuDetail.subscriptionDeliveryCycle]}회 배송
                  </TextB2R>
                </DeliveryLi>
                <DeliveryLi>
                  <TextB2R>상품 구성</TextB2R>
                  <TextB2R>단백질 위주의 식단 교차 배송</TextB2R>
                </DeliveryLi>
              </DeliveryUl>
            </DeliveryInfoBox>
          )}
        </MenuDetailWrapper>
        <ReviewContainer>
          {reviews?.searchReviewImages?.length! > 0 && (
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
          )}
        </ReviewContainer>
        <DetailInfoContainer>
          {MENU_DETAIL_INFORMATION.map((info, index) => (
            <div key={index}>
              <DetailInfoWrapper>
                <TextH4B>{info.text}</TextH4B>
                <Link href={`${info.link}`} passHref>
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
      <AdWrapper></AdWrapper>
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
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.greyScale6};
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
  background: rgba(36, 36, 36, 0.5);
  border-radius: 24px;
`;

const ReviewContainer = styled.div`
  background-color: ${theme.greyScale3};
`;

const AdWrapper = styled.div`
  width: 100%;
  height: 96px;
  background-color: #dedede;
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
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { menuId: string } }) {
  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus/${params.menuId}`);

  return {
    props: { menuDetail: data.data },
    revalidate: 100,
  };
}

export default React.memo(MenuDetailPage);
