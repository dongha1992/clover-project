import React, { useState, useEffect, useCallback } from 'react';
import { Router, useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Obj } from '@model/index';
import styled from 'styled-components';

const HomeBottom = dynamic(() => import('./HomeBottom'));
const DetailBottom = dynamic(() => import('./DetailBottom'));
/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

function Bottom() {
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

      switch (true) {
        case ['/home'].includes(currentPath): {
          return <HomeBottom />;
        }
        case ['/menu/[id]'].includes(currentPath): {
          return <DetailBottom />;
        }
        default: {
          return;
        }
      }
    },
    [currentPath]
  );

  return <Container>{renderComponent(currentPath)}</Container>;
}

const Container = styled.div`
  margin-top: 62px;
`;
export default React.memo(Bottom);
