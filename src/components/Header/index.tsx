import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';
import { CATEGORY_TITLE_MAP } from '@constants/menu';
import { SET_SCROLL } from '@store/common';
import { useDispatch } from 'react-redux';
import { breakpoints } from '@utils/common/getMediaQuery';
import useScrollCheck from '@hooks/useScrollCheck';

const HomeHeader = dynamic(() => import('./HomeHeader'));
const DefaultHeader = dynamic(() => import('./DefaultHeader'));
const CategorySubHeader = dynamic(() => import('./CategorySubHeader'));
const MenuDetailHeader = dynamic(() => import('./MenuDetailHeader'));
const TabHeader = dynamic(() => import('./TabHeader'));
const MyPageHeader = dynamic(() => import('./MyPageHeader'));
const NotiHeader = dynamic(() => import('./NotiHeader'));
const SpotHeader = dynamic(() => import('./SpotHeader'));
const SpotSearchHeader = dynamic(() => import('./SpotSearchHeader'));
const CloseDefaultHeader = dynamic(() => import('./CloseDefaultHeader'));
const DefaultHeaderWithCart = dynamic(() => import('./DefaultHeaderWithCart'));
const SubscriptionHeader = dynamic(() => import('./SubscriptionHeader'));
const SpotStatusDetailHeader = dynamic(() => import('./SpotStatusDetailHeader'));
const SpotDetailHeader = dynamic(() => import('./SpotDetailHeader'));

/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPath, setCurrentPath] = useState<string>(router.pathname);
  // const [scroll, setScroll] = useState(false);

  const scroll = useScrollCheck();

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  // useEffect(() => {
  //   dispatch(SET_SCROLL(false));
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll); //clean up
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handleScroll = () => {
  //   if (window.scrollY) {
  //     setScroll(true);
  //     dispatch(SET_SCROLL(true));
  //   } else {
  //     setScroll(false);
  //     dispatch(SET_SCROLL(false));
  //   }
  // };

  const { category } = router.query;

  const renderComponent = (currentPath: string) => {
    const headerTitleMap: Obj = {
      '/search': '검색',
      '/search/result': '검색',
      '/location': '내 위치 설정하기',
      '/location/address-detail': '내 위치 설정하기',
      '/category/[category]': CATEGORY_TITLE_MAP[category?.toString()!],
      '/menu/[menuId]/review/photo': '사진 후기',
      '/menu/[menuId]/review/total': '전체 후기',
      '/menu/[menuId]/review/[contentId]': '후기 상세',
      '/cart': '장바구니',
      '/cart/delivery-info': '배송정보',
      '/order': '결제',
      '/mypage/card': '결제관리',
      '/mypage/card/register': '카드등록',
      '/mypage/card/edit': '카드 편집',
      '/mypage/card/register/term': '이용약관',
      '/mypage/order-detail/[id]': '주문 상세',
      '/mypage/order-delivery-history': '주문/배송 내역',
      '/mypage/profile/password': '비밀번호 변경',
      '/mypage/profile/confirm': '회원정보 수정',
      '/mypage/profile/dormant': '회원정보 수정',
      '/mypage/profile': '회원정보 수정',
      '/mypage/profile/secession': '회원탈퇴',
      '/mypage/dib/general': '찜 관리',
      '/mypage/friend': '친구 초대',
      '/mypage/review': '후기 관리',
      '/mypage/review/write/[orderDeliveryId]': '후기 작성',
      '/mypage/review/edit/[reviewId]': '후기 편집',
      '/mypage/rank': '회원등급',
      '/mypage/customer-service': '고객센터',
      '/mypage/point': '포인트',
      '/mypage/address': '주소 관리',
      '/mypage/address/edit/[id]': '편집',
      '/mypage/coupon': '쿠폰',
      '/mypage/term': '약관 및 정책',
      '/mypage/term/use': '이용약관',
      '/mypage/term/privacy': '개인정보 처리방침',
      '/mypage/term/location': '위치정보 서비스 이용 약관',
      '/mypage/setting': '앱설정',
      '/mypage/dib/subscription': '찜 관리',
      '/mypage/order-detail/edit/[orderId]': '배송정보 변경',
      '/mypage/order-detail/cancel/[orderId]': '주문취소',
      '/order/finish': '결제완료',
      '/signup': '회원가입',
      '/signup/auth': '회원가입',
      '/signup/email-password': '회원가입',
      '/signup/optional': '회원가입',
      '/signup/change-name': '회원가입',
      '/login': '로그인',
      '/login/find-account/email': '이메일/비밀번호 찾기',
      '/login/find-account/password': '이메일/비밀번호 찾기',
      '/spot/search': '프코스팟 검색',
      '/spot/search/result': '프코스팟 검색',
      '/spot/join': '프코스팟 신청 안내',
      '/spot/join/main': '신청하기',
      '/spot/join/main/form': '신청하기',
      '/spot/join/main/form/submit': '신청하기',
      '/spot/join/main/form/submit/finish': '신청하기',
      '/destination/search': '배송지 검색',
      '/destination/destination-detail': '배송지 검색',
      '/spot/status': '스팟 관리',
      '/spot/location': '주소 검색',
      '/spot/location/address': '주소 검색',
      '/spot/notice': '프코스팟 안내',
      '/mypage/spot-status': '프코스팟 관리',
      '/subscription/information': '구독 안내',
      '/subscription/products': '정기구독',
      '/subscription/set-info': '구독하기',
      '/subscription/register': '구독하기',
      '/subscription/register/diet-info': '전체 식단 정보',
      '/subscription/[detailId]/diet-info': '전체 식단 정보',
      '/mypage/subscription': '구독관리',
      '/subscription/[detailId]': '구독상세',
      '/subscription/[detailId]/cancel': '주문취소',
      '/subscription/[detailId]/sub-cancel': '주문취소',
      '/subscription/[detailId]/sub-cancel/complete': '취소완료',
      '/subscription/[detailId]/cancel/complete': '취소완료',
    };

    const title = headerTitleMap[currentPath];

    switch (true) {
      case ['/category/[category]'].includes(currentPath):
        return (
          <Container scroll={scroll}>
            <CategorySubHeader title={title} />
          </Container>
        );

      case ['/menu/[menuId]'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <MenuDetailHeader />
          </Container>
        );
      }

      case ['/mypage'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <MyPageHeader />
          </Container>
        );
      }

      case ['/mypage/noti'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <NotiHeader />
          </Container>
        );
      }

      case [
        '/menu/[menuId]/detail/product',
        '/menu/[menuId]/detail/nutrition',
        '/menu/[menuId]/detail/delivery',
        '/login/find-account/email',
        '/login/find-account/password',
        '/mypage/dib/general',
        '/mypage/dib/subscription',
      ].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <TabHeader title={title} />
          </Container>
        );
      }

      case [
        '/search',
        '/search/result',
        '/mypage/dib/general',
        '/mypage/dib/subscription',
        '/mypage/order-detail',
      ].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <DefaultHeaderWithCart title={title} />
          </Container>
        );
      }

      case ['/'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <HomeHeader />
          </Container>
        );
      }
      case ['/subscription'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SubscriptionHeader />
          </Container>
        );
      }

      case ['/spot'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SpotHeader />
          </Container>
        );
      }

      case ['/spot/detail/[id]'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SpotDetailHeader />
          </Container>
        );
      }

      case ['/spot/search', '/spot/search/result'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SpotSearchHeader title={title} />
          </Container>
        );
      }

      case ['/spot/join/main/form/submit/finish', '/spot/open'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <CloseDefaultHeader title={title} />
          </Container>
        );
      }

      case ['/mypage/spot-status/detail/[id]'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SpotStatusDetailHeader />
          </Container>
        );
      }

      case ['/mypage/spot-status', '/mypage/review', '/mypage/address'].includes(currentPath): {
        return (
          <Container>
            <DefaultHeader title={title} />
          </Container>
        );
      }
      case ['/onboarding'].includes(currentPath): {
        return null;
      }

      default: {
        return (
          <Container scroll={scroll}>
            <DefaultHeader title={title} />
          </Container>
        );
      }
    }
  };

  return <>{renderComponent(currentPath)}</>;
};

const Container = styled.div<{ scroll?: boolean }>`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 998;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ scroll }) => {
    if (scroll) {
      return css`
        //box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
        filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
      `;
    }
  }};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export default React.memo(Header);
