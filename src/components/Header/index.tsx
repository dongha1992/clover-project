import React, { useState, useEffect, useCallback } from 'react';
import { Router, useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';

const HomeHeader = dynamic(() => import('./HomeHeader'));
const DefaultHeader = dynamic(() => import('./DefaultHeader'));
const CategorySubHeader = dynamic(() => import('./CategorySubHeader'));
const MenuDetailHeader = dynamic(() => import('./MenuDetailHeader'));
/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */
/*TODO: 사진 후기 수 타이틀 옆에 나와야 함*/

function Header() {
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
        '/location/address-detail': '내 위치 설정하기',
        '/category': '전체메뉴',
        '/category/salad': '샐러드',
        '/review': '사진 후기',
        '/review/[id]': '후기 상세',
        '/cart': '장바구니',
      };

      const title = headerTitleMap[currentPath];

      switch (true) {
        case [
          '/location',
          '/location/address-detail',
          '/search',
          '/review',
          '/review/[id]',
          '/cart',
        ].includes(currentPath): {
          return <DefaultHeader title={title} />;
        }
        case [
          '/category',
          '/category/salad',
          '/menu/detail/product',
          '/menu/detail/nutrition',
          '/menu/detail/delivery',
        ].includes(currentPath):
          return <CategorySubHeader title={title} />;

        case ['/menu/[id]'].includes(currentPath): {
          return <MenuDetailHeader />;
        }

        default: {
          return <HomeHeader />;
        }
      }
    },
    [currentPath]
  );

  return <>{renderComponent(currentPath)}</>;
}
export default React.memo(Header);
