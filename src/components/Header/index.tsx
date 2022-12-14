import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';
import { CATEGORY_TITLE_MAP } from '@constants/menu';
import { useDispatch, useSelector } from 'react-redux';
import { breakpoints } from '@utils/common/getMediaQuery';
import useScrollCheck from '@hooks/useScrollCheck';
import { eventSelector } from '@store/event';

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
  const { eventTitle } = useSelector(eventSelector);
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

  const { category, isKakao } = router.query;
  const isKakaoRegister = isKakao === 'true';

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
      '/mypage/card/edit': '카드 수정',
      '/mypage/order-delivery-history': '주문/배송 내역',
      '/mypage/profile/password': '비밀번호 변경',
      '/mypage/profile/confirm': '회원정보 수정',
      '/mypage/profile/dormant': '회원정보 수정',
      '/mypage/profile': '회원정보 수정',
      '/mypage/profile/secession': '회원탈퇴',
      '/mypage/dib/general': '찜한 상품',
      '/mypage/friend': '친구 초대',
      '/mypage/review/schedule': '후기 작성',
      '/mypage/review/completed': '후기 작성',
      '/mypage/review/write/[orderDeliveryId]': '후기 작성',
      '/mypage/review/completed/edit/[reviewId]': '후기 수정',
      '/mypage/rank': '회원등급',
      '/mypage/customer-service': '고객센터',
      '/mypage/point': '포인트',
      '/mypage/address/pickup': '배송지 관리',
      '/mypage/address/delivery': '배송지 관리',
      '/mypage/address/edit/[id]': '수정',
      '/mypage/coupon': '쿠폰',
      '/mypage/term': '약관 및 정책',
      '/mypage/term/use': '이용약관',
      '/mypage/term/privacy': '개인정보 처리방침',
      '/mypage/term/location': '위치정보 서비스 이용 약관',
      '/mypage/setting': '설정',
      '/mypage/dib/subscription': '찜한 상품',
      '/mypage/order-detail/edit/[orderId]': '배송정보 변경',
      '/mypage/order-detail/cancel/[orderId]': '주문취소',
      '/order/finish': '결제완료',
      '/signup': '회원가입',
      '/signup/auth': '회원가입',
      '/signup/email-password': '회원가입',
      '/signup/optional': '회원가입',
      '/signup/change-name': `${isKakaoRegister ? '회원가입' : '이름 변경'}`,
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
      '/spot/location': '주소 검색',
      '/spot/location/address': '주소 검색',
      '/spot/notice': '프코스팟 안내',
      '/mypage/spot/status': '프코스팟 관리',
      '/mypage/spot/wish': '프코스팟 관리',
      '/subscription/information': '구독 안내',
      '/subscription/products': '정기구독',
      '/subscription/set-info': '구독하기',
      '/subscription/register': '구독하기',
      '/subscription/register/diet-info': '전체 식단 정보',
      '/subscription/[detailId]/diet-info': '전체 식단 정보',
      '/mypage/subscription': '구독 내역',
      '/subscription/[detailId]': '구독상세',
      '/subscription/[detailId]/cancel': '주문취소',
      '/subscription/[detailId]/sub-cancel': '주문취소',
      '/subscription/[detailId]/sub-cancel/complete': '취소완료',
      '/subscription/[detailId]/cancel/complete': '취소완료',
      '/promotion': '기획전',
      '/event': '이벤트·소식',
      '/promotion/detail/[id]': `${eventTitle ? eventTitle : '기획전'}`,
    };

    const title = headerTitleMap[currentPath];

    switch (true) {
      case ['/category/[category]'].includes(currentPath):
        return (
          <Container>
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
          <Container>
            <NotiHeader />
          </Container>
        );
      }

      case [
        '/login/find-account/email',
        '/login/find-account/password',
        '/mypage/dib/general',
        '/mypage/dib/subscription',
        '/menu/[menuId]/detail/product',
        '/menu/[menuId]/detail/nutrition',
        '/menu/[menuId]/detail/delivery',
        '/mypage/spot/status',
        '/mypage/spot/wish',
        '/mypage/review/schedule',
        '/mypage/review/completed',
        '/mypage/address/pickup',
        '/mypage/address/delivery',
      ].includes(currentPath): {
        return (
          <Container>
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
        '/promotion/detail/[id]',
        '/mypage/order-detail/[id]',
        '/md',
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

      case ['/mypage/spot/status/detail/[id]'].includes(currentPath): {
        return (
          <Container scroll={scroll}>
            <SpotStatusDetailHeader />
          </Container>
        );
      }

      case ['/onboarding', '/order/order-app'].includes(currentPath): {
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
  left: calc(50%);
  top: 0;
  right: 0;
  z-index: 998;
  height: 56px;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ scroll }) => {
    if (scroll) {
      return css`
        ${({ theme }) => theme.mobile`
        margin: 0 auto;
        left: 0px;
      `};
        ${({ theme }) => theme.desktop`
        margin: 0 auto;
        left: 0px;
      `};
        &::after {
          content: '';
          display: block;
          position: absolute;
          right: 0;
          left: 0px;
          bottom: -20px;
          height: 20px;
          background-size: 30px auto;
          background-image: url("data:image/svg+xml,%3Csvg width='45' height='30' viewBox='0 0 45 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='45' height='30' fill='url(%23paint0_linear_1899_3133)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_1899_3133' x1='22.5' y1='0' x2='22.5' y2='16.5' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-opacity='0.2'/%3E%3Cstop offset='0.135417' stop-opacity='0.1'/%3E%3Cstop offset='0.369792' stop-opacity='0.0326087'/%3E%3Cstop offset='0.581127' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
          ${({ theme }) => theme.mobile`
            margin: 0 auto;
            left: 0;
          `};
        }
      `;
    }
  }};
`;

export default React.memo(Header);
