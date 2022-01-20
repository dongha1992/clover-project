import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const HomeBottom = dynamic(() => import('./HomeBottom'));
const DetailBottom = dynamic(() => import('./DetailBottom'));
const SpotDetailBottom = dynamic(() => import('./SpotDetailBottom'));
/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

const Bottom = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>(router.pathname);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const renderComponent = useCallback(
    (currentPath: string) => {
      switch (true) {
        case ['/quickorder', '/', '/spot', '/mypage', '/subscription'].includes(
          currentPath
        ): {
          return <HomeBottom />;
        }
        case ['/menu/[menuId]'].includes(currentPath): {
          return <DetailBottom />;
        }
        case ['/spot/detail/[id]'].includes(currentPath): {
          return <SpotDetailBottom />;
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
};

const Container = styled.div<{ isShow: React.ReactNode }>`
  margin-top: ${({ isShow }) => (isShow ? 62 : 0)}px;
  display: ${({ isShow }) => (isShow ? '' : 'none')};
`;
export default React.memo(Bottom);
