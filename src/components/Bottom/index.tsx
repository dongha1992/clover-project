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
      switch (true) {
        case [
          '/quickorder',
          '/home',
          '/spot',
          '/mypage',
          '/subscription',
        ].includes(currentPath): {
          return <HomeBottom />;
        }
        case ['/menu/[menuId]', '/spot/detail/[id]'].includes(currentPath): {
          return <DetailBottom />;
        }
        default: {
          return;
        }
      }
    },
    [currentPath]
  );

  return (
    <Container isShow={renderComponent(currentPath)}>
      {renderComponent(currentPath)}
    </Container>
  );
}

const Container = styled.div<{ isShow: React.ReactNode }>`
  margin-top: ${({ isShow }) => (isShow ? 62 : 0)}px;
  display: ${({ isShow }) => (isShow ? '' : 'none')};
`;
export default React.memo(Bottom);
