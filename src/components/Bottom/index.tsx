import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
// import HomeBottom from './HomeBottom';
// import DetailBottom from './DetailBottom';
// import SpotDetailBottom from './SpotDetailBottom';

const HomeBottom = dynamic(() => import('./HomeBottom'));
const DetailBottom = dynamic(() => import('./DetailBottom'));
const SpotDetailBottom = dynamic(() => import('./SpotDetailBottom'));
/*TODO: 페이지 이동 시 이전 route 호출로 렌더 두 번 */

const Bottom = ({ children }: any) => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>(router.pathname);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const renderComponent = useCallback(
    (currentPath: string): ReactElement | null => {
      switch (true) {
        case ['/', '/spot', '/mypage', '/subscription'].includes(currentPath): {
          return <HomeBottom />;
        }
        case ['/menu/[menuId]'].includes(currentPath): {
          return <DetailBottom />;
        }
        case ['/spot/detail/[id]'].includes(currentPath): {
          return <SpotDetailBottom />;
        }
        case [
          '/subscription/information',
          '/mypage/subscription',
          '/mypage/order-detail/[id]',
          '/subscription/[detailId]',
          '/menu/[menuId]/review/total',
          '/mypage/order-delivery-history',
          '/mypage/review/schedule',
          '/mypage/review/completed',
          '/order',
        ].includes(currentPath): {
          return null;
        }
        default: {
          return <></>;
        }
      }
    },
    [currentPath]
  );

  return <Container isShow={children}>{children}</Container>;
};

const Container = styled.div<{ isShow: React.ReactNode }>`
  margin-top: ${({ isShow }) => (isShow ? 56 : 0)}px;
  display: ${({ isShow }) => (isShow ? '' : 'none')};
  background-color: white;
`;
export default Bottom;
