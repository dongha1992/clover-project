import React, { useState, useEffect, useRef, useCallback } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import { TextH2B, TextB2R, TextH6B, TextH3B, TextH7B, TextB3R, TextH4B, TextB4R } from '@components/Shared/Text';
import Image from 'next/image';
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
import { getMenuDetailApi, getMenuDetailReviewApi } from '@api/menu';
import { BASE_URL, IMAGE_S3_URL } from '@constants/mock';
import { ALL_REVIEW } from '@constants/menu';
import { getMenuDisplayPrice } from '@utils/getMenuDisplayPrice';

import axios from 'axios';

const DetailBottomFAQ = dynamic(() => import('@components/Pages/Detail/DetailBottomFAQ'));

const DetailBottomReview = dynamic(() => import('@components/Pages/Detail/DetailBottomReview'));

/* TODO: 영양 정보 리팩토링 */
/* TODO: 영양 정보 샐러드만 보여줌 */
/* TODO: 베스트후기 없으면 안 보여줌  */

const hasAvailableCoupon = true;

const MenuDetailPage = ({ menuId }: any) => {
  const [menuItem, setMenuItem] = useState<any>({});
  const [isSticky, setIsStikcy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('/menu/[id]');
  const tabRef = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const HEADER_HEIGHT = 56;
  let timer: any = null;

  const dispatch = useDispatch();

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

      // return data.data;
      return ALL_REVIEW.data.data;
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
        {/* <CountWrapper>
          <TextH6B color={theme.white}>{`${currentImg + 1} / ${data?.url.length}`}</TextH6B>
        </CountWrapper> */}
      </ImgWrapper>
      <Top>
        <MenuDetailWrapper>
          <MenuNameWrapper>
            <TextH2B padding={'0 0 8px 0'}>{data.name}</TextH2B>
            {/* {menuItem.tag.map((tag: string, index: number) => {
              if (index > 1) return;
              return (
                <Tag key={index} margin="0 4px 0 0">
                  {tag}
                </Tag>
              );
            })} */}
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
          <BorderLine height={1} margin="16px 0" />
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

const Container = styled.section``;

const ImgWrapper = styled.div`
  position: relative;
`;

const Top = styled.div``;

const MenuDetailWrapper = styled.div`
  ${homePadding}
`;

const MenuNameWrapper = styled.div`
  margin: 24px 0 16px 0;
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const NutritionInfoWrapper = styled.div``;

const NutritionInfoBox = styled.div`
  display: flex;
  align-items: center;
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
  margin-top: 24px;
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

/*TODO: 수정해야함 */
export async function getServerSideProps(context: any) {
  const { menuId } = context.query;
  return {
    props: { menuId },
  };
}

export default React.memo(MenuDetailPage);
