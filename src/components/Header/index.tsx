import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';
import QuickOrderHeader from './QuickOrderHeader';

const HomeHeader = dynamic(() => import('./HomeHeader'));
const DefaultHeader = dynamic(() => import('./DefaultHeader'));
const CategorySubHeader = dynamic(() => import('./CategorySubHeader'));
const MenuDetailHeader = dynamic(() => import('./MenuDetailHeader'));
const TabHeader = dynamic(() => import('./TabHeader'));
const MyPageHeader = dynamic(() => import('./MyPageHeader'));
const SpotHeader = dynamic(() => import('./SpotHeader'));
const SpotSearchHeader = dynamic(() => import('./SpotSearchHeader'));
const CloseDefaultHeader = dynamic(() => import('./CloseDefaultHeader'));
const DefaultHeaderWithCart = dynamic(() => import('./DefaultHeaderWithCart'));
/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

const Header = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>(router.pathname);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const renderComponent = useCallback(
    (currentPath: string) => {
      const headerTitleMap: Obj = {
        '/search': '검색',
        '/location': '내 위치 설정하기',
        '/location/address-detail': '배송위치',
        '/category': '전체메뉴',
        '/category/salad': '샐러드',
        '/menu/[menuId]/review/photo': '사진 후기',
        '/menu/[menuId]/review/total': '전체 후기',
        '/menu/[menuId]/review/[id]': '후기 상세',
        '/cart': '장바구니',
        '/cart/delivery-info': '배송정보',
        '/spot/search': '프코스팟 검색',
        '/payment': '결제',
        '/mypage/card': '결제관리',
        '/mypage/card/register': '카드등록',
        '/mypage/card/edit': '카드 편집',
        '/mypage/card/register/term': '이용약관',
        '/mypage/order-detail': '주문 상세',
        '/mypage/order-delivery-history': '주문/배송 내역',
        '/mypage/profile/password': '비밀번호 변경',
        '/mypage/profile/confirm': '회원정보 수정',
        '/mypage/profile/dormant': '회원정보 수정',
        '/mypage/profile': '회원정보 수정',
        '/mypage/profile/secession': '회원탈퇴',
        '/mypage/dib/general': '찜 관리',
        '/mypage/friend': '친구 초대',
        '/mypage/review': '후기 관리',
        '/mypage/review/write/[menuId]': '후기 작성',
        '/mypage/rank': '회원등급',
        '/mypage/customer-service': '고객센터',
        '/mypage/point': '포인트',
        '/mypage/address': '주소 관리',
        '/mypage/address/edit/[id]': '편집',
        '/mypage/coupon': '포인트',
        '/mypage/term': '약관 및 정책',
        '/mypage/term/use': '이용약관',
        '/mypage/term/privacy': '개인정보 처리방침',
        '/mypage/term/location': '위치정보 서비스 이용 약관',
        '/mypage/setting': '앱설정',
        '/mypage/dib/subscription': '찜 관리',
        '/mypage/order-detail/edit/[orderId]': '배송정보 변경',
        '/payment/finish': '결제완료',
        '/signup': '회원가입',
        '/signup/auth': '회원가입',
        '/signup/email-password': '회원가입',
        '/signup/optional': '회원가입',
        '/login': '로그인',
        '/login/find-account/email': '아이디/비밀번호 찾기',
        '/login/find-account/password': '아이디/비밀번호 찾기',
        '/spot/spot-req': '신청하기',
        '/spot/register': '신청하기',
        '/spot/register/submit': '신청하기',
        '/spot/register/submit/finish': '신청하기',
        '/destination/search': '배송지 검색',
        '/destination/destination-detail': '배송지 검색',
        '/spot/search/location': '프코스팟 검색',
        '/spot/status': '스팟 관리',
        '/spot/location': '주소 검색',
        '/spot/location/address': '주소 검색',
        '/spot/regi-list': '프코스팟 안내',
      };

      const title = headerTitleMap[currentPath];

      switch (true) {
        case ['/category', '/category/salad'].includes(currentPath):
          return <CategorySubHeader title={title} />;

        case ['/menu/[menuId]', '/spot/detail/[id]'].includes(currentPath): {
          return <MenuDetailHeader />;
        }

        case ['/mypage'].includes(currentPath): {
          return <MyPageHeader />;
        }

        case [
          '/menu/detail/product',
          '/menu/detail/nutrition',
          '/menu/detail/delivery',
          '/login/find-account/email',
          '/login/find-account/password',
          '/mypage/dib/general',
          '/mypage/dib/subscription',
        ].includes(currentPath): {
          return <TabHeader title={title} />;
        }

        case ['/search', '/mypage/dib/general', '/mypage/dib/subscription', '/mypage/order-detail'].includes(
          currentPath
        ): {
          return <DefaultHeaderWithCart title={title} />;
        }

        case ['/'].includes(currentPath): {
          return <HomeHeader />;
        }

        case ['/spot'].includes(currentPath): {
          return <SpotHeader />;
        }

        case ['/quickorder', '/quickorder/category'].includes(currentPath): {
          return <QuickOrderHeader />;
        }

        case ['/spot/search', '/spot/search/location'].includes(currentPath): {
          return <SpotSearchHeader title={title} />;
        }

        case ['/spot/register/submit/finish'].includes(currentPath): {
          return <CloseDefaultHeader title={title} />;
        }

        default: {
          return <DefaultHeader title={title} />;
        }
      }
    },
    [currentPath]
  );

  return <>{renderComponent(currentPath)}</>;
};
export default React.memo(Header);
