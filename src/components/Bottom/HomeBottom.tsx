import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { TextH7B, TextB4R } from '@components/Shared/Text';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { theme } from '@styles/theme';
import { useGetNotiInfo } from '@queries/notification';

const textStyle = {
  padding: '4px 0 0 0',
};

const BOTTOM_MENU = [
  { id: 1, text: '홈', link: '/', svg: 'home', activeSvg: 'homeActive' },
  {
    id: 2,
    text: '구독',
    link: '/subscription',
    svg: 'subscription',
    activeSvg: 'subscriptionActive',
  },
  {
    id: 3,
    text: '프코스팟',
    link: '/spot',
    svg: 'fcoSpot',
    activeSvg: 'fcoSpotActive',
  },
  {
    id: 4,
    text: '마이',
    link: '/mypage',
    svg: 'mypage',
    activeSvg: 'mypageActive',
  },
];

/* TODO: selected tab hook으로 빼고 싶다.. */

const Bottom = (): ReactElement => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('/category');
  const { data } = useGetNotiInfo('notiInfo', {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  const goToPage = (link: string) => {
    router.push(link);
  };

  return (
    <Container>
      <MenuWrapper>
        {BOTTOM_MENU.map((menu, index) => (
          <MenuItem onClick={() => goToPage(menu.link)} key={index}>
            <div className={`svgBox ${menu.id === 4 && data > 0 ? 'on' : ''}`}>
              <SVGIcon name={selectedTab === menu.link ? menu.activeSvg : menu.svg} />
            </div>
            {selectedTab === menu.link ? (
              <TextH7B {...textStyle}>{menu.text}</TextH7B>
            ) : (
              <TextB4R {...textStyle}>{menu.text}</TextB4R>
            )}
          </MenuItem>
        ))}
      </MenuWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;
  border-top: 1px solid ${theme.greyScale6};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
`;

const MenuItem = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  .svgBox {
    position: relative;
    &.on::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: ${theme.brandColor};
    }
  }
`;

export default React.memo(Bottom);
