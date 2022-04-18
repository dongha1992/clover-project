import React, { useState, useEffect, useRef, useCallback } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH2B, TextB2R, TextH6B, TextH3B, TextH4B, TextH5B } from '@components/Shared/Text';
import Loading from '@components/Loading';
import { Tag } from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import BorderLine from '@components/Shared/BorderLine';
import { ReviewList } from '@components/Pages/Review';
import { MENU_DETAIL_INFORMATION, MENU_REVIEW_AND_FAQ } from '@constants/menu';
import Link from 'next/link';
import { StickyTab } from '@components/Shared/TabList';
import { useDispatch } from 'react-redux';
import { SET_MENU_ITEM } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { CouponSheet } from '@components/BottomSheet/CouponSheet';
import dynamic from 'next/dynamic';
import { DetailBottomInfo } from '@components/Pages/Detail';
import Carousel from '@components/Shared/Carousel';
import { useQuery } from 'react-query';
import { getMenuDetailApi } from '@api/menu';
import { BASE_URL } from '@constants/mock';
import { getMenuDisplayPrice } from '@utils/getMenuDisplayPrice';

import axios from 'axios';
import { SUBS_INIT } from '@store/subscription';

const DetailBottomFAQ = dynamic(() => import('@components/Pages/Detail/DetailBottomFAQ'));

const DetailBottomReview = dynamic(() => import('@components/Pages/Detail/DetailBottomReview'));

/* TODO: 영양 정보 리팩토링 */
/* TODO: 영양 정보 샐러드만 보여줌 */
/* TODO: 베스트후기 없으면 안 보여줌  */

const hasAvailableCoupon = true;

const SubsProductIdPage = ({ menuId = 135 }: any) => {
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('/menu/[id]');
  const tabRef = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const HEADER_HEIGHT = 56;
  let timer: any = null;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SUBS_INIT());
  }, []);

  const {
    data,
    error: menuError,
    isLoading,
  } = useQuery(
    'getMenuDetail',
    async () => {
      const { data } = await getMenuDetailApi(menuId);

      return data.data;
    },

    {
      onSuccess: (data) => {
        dispatch(SET_MENU_ITEM(data));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: reviews, error } = useQuery(
    'getMenuDetailReview',
    async () => {
      // const { data } = await getMenuDetailReviewApi(menuId);
      const { data } = await axios.get(`${BASE_URL}/review`);

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
    router.push(`/menu/${menuId}/review/${review.id}`);
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
        return <DetailBottomReview reviews={reviews} isSticky={isSticky} menuId={menuId} />;
      case '/menu/detail/faq':
        return <DetailBottomFAQ />;
      default:
        return <DetailBottomInfo />;
    }
  };

  const getMenuDetailPrice = () => {
    const { discount, price, discountedPrice } = getMenuDisplayPrice(data?.menuDetails);

    return { discount, price, discountedPrice };
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);
    return () => {
      window.removeEventListener('scroll', onScrollHandler);
      dispatch(SET_MENU_ITEM({}));
      clearTimeout(timer);
    };
  }, [tabRef?.current?.offsetTop]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <ImgWrapper>
        <Carousel images={data?.thumbnail} setCountIndex={setCurrentImg} />
        <DailySaleNumber>
          {data?.badgeMessage && (
            <TextH6B padding="4px" color={theme.white} backgroundColor={theme.brandColor}>
              {data?.badgeMessage}
            </TextH6B>
          )}
        </DailySaleNumber>
      </ImgWrapper>
      <Top>
        <MenuDetailWrapper>
          <MenuNameWrapper>
            <TextH2B padding={'0 0 8px 0'}>{data.name}</TextH2B>
            {data.tag && <Tag margin="0 4px 0 0">{data.tag}</Tag>}
          </MenuNameWrapper>
          <TextB2R padding="0 0 16px 0" color={theme.greyScale65}>
            {data.description}
          </TextB2R>
          <PriceAndCouponWrapper>
            <PriceWrapper>
              <OriginPrice>
                <TextH6B color={theme.greyScale25} textDecoration=" line-through">
                  {getMenuDetailPrice().price}원
                </TextH6B>
              </OriginPrice>
              <DiscountedPrice>
                <TextH3B color={theme.brandColor}>{getMenuDetailPrice().discount}%</TextH3B>
                <TextH3B padding={'0 0 0 4px'}>{getMenuDetailPrice().discountedPrice}원</TextH3B>
              </DiscountedPrice>
            </PriceWrapper>
            {hasAvailableCoupon ? (
              <CouponWrapper onClick={couponDownloadHandler}>
                <TextH6B padding="4px 4px 0 0">쿠폰 받기</TextH6B>
                <SVGIcon name="download" />
              </CouponWrapper>
            ) : (
              <CouponWrapper>
                <TextH6B padding="4px 4px 0 0">발급 완료</TextH6B>
                <SVGIcon name="checkBlack18" />
              </CouponWrapper>
            )}
          </PriceAndCouponWrapper>
          <DeliveryInfoBox>
            <TextH5B padding="16px 0">배송 안내</TextH5B>
            <DeliveryUl>
              <DeliveryLi>
                <TextB2R>배송 정보</TextB2R>
                <TextB2R>스팟배송 / 주 2회 배송</TextB2R>
              </DeliveryLi>
              <DeliveryLi>
                <TextB2R>상품 구성</TextB2R>
                <TextB2R>단백질 위주의 식단 교차 배송</TextB2R>
              </DeliveryLi>
            </DeliveryUl>
          </DeliveryInfoBox>
        </MenuDetailWrapper>
        <ReviewContainer>
          <ReviewWrapper>
            <ReviewHeader>
              <TextH4B padding="0 0 16px 0">베스트 후기</TextH4B>
              <TextH6B
                textDecoration="underline"
                color={theme.greyScale65}
                padding="0 24px 0 0"
                onClick={goToReviewSection}
              >
                더보기
              </TextH6B>
            </ReviewHeader>
            {reviews && <ReviewList reviews={reviews} onClick={goToReviewDetail} />}
          </ReviewWrapper>
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

const Container = styled.section`
  color: #242424;
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const Top = styled.div``;

const MenuDetailWrapper = styled.div`
  padding: 24px;
`;

const MenuNameWrapper = styled.div`
  padding: 0 0 16px 0;
`;

const PriceAndCouponWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 24px;
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

const OriginPrice = styled.div``;

const DiscountedPrice = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewContainer = styled.div`
  background-color: ${theme.greyScale3};
`;

const AdWrapper = styled.div`
  width: 100%;
  height: 96px;
  background-color: grey;
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
  left: 0;
  top: 0;
`;

export default React.memo(SubsProductIdPage);
