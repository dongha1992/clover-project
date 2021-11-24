import React, { useState, useEffect, useCallback } from 'react';
import { Router, useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';

const HomeHeader = dynamic(() => import('./HomeHeader'));
const DefaultHeader = dynamic(() => import('./DefaultHeader'));
const CategorySubHeader = dynamic(() => import('./CategorySubHeader'));
const MenuDetailHeader = dynamic(() => import('./MenuDetailHeader'));

/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

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
        '/locationaddress-detaill': '내 위치 설정하기',
        '/category': '전체메뉴',
        '/category/salad': '샐러드',
      };

      const title = headerTitleMap[currentPath];

      switch (true) {
        case currentPath.includes('location'):
        case currentPath.includes('locationaddress-detaill'):
        case currentPath.includes('search'): {
          return <DefaultHeader title={title} />;
        }
        case currentPath.includes('category'):
          return <CategorySubHeader title={title} />;
        case currentPath.includes('menu'): {
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
