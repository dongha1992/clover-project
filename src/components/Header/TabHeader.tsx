import React, { useEffect, useState, useCallback } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { MENU_DETAIL_INFORMATION } from '@constants/menu';
import { FIND_ACCOUNT } from '@constants/login';
import { DIB_MENU } from '@constants/mypage';
import dynamic from 'next/dynamic';
import { breakpoints } from '@utils/common/getMediaQuery';
import { TextH4B } from '@components/Shared/Text';
import { Obj } from '@model/index';
import { useQueryClient } from 'react-query';
// import { TabList } from '@components/Shared/TabList';

const TabList = dynamic(() => import('../Shared/TabList/TabList'));

type TProps = {
  title?: string;
};

/* TODO: 뒤로가기 시 replace로 교체 */

const TabHeader = ({ title }: TProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string>('/login/find-account/email');

  useEffect(() => {
    queryClient.invalidateQueries('getLikeMenus');
  }, []);

  const goBack = (): void => {
    /* TODO: 맵핑해서 router 변경 조건 만들어야함 */
    if (router.asPath === '/login/find-account/password' || router.asPath === '/login/find-account/email') {
      router.push('/login');
    } else if (router.pathname.split('/').includes('detail')) {
      router.push(`/menu/${router.query.menuId}`);
    } else {
      router.back();
    }
  };

  const clickTabHandler = useCallback(
    (tabItem: any) => {
      setSelectedTab(tabItem.link);

      if (router.query.menuId) {
        router.push({ pathname: `${tabItem.link}`, query: { menuId: router.query.menuId } });
      } else {
        router.push(`${tabItem.link}`);
      }
    },
    [router]
  );

  useEffect(() => {
    if (router.isReady) setSelectedTab(router.pathname);
  }, [router.isReady]);

  const mapper: Obj = {
    '이메일/비밀번호 찾기': FIND_ACCOUNT,
    '찜 관리': DIB_MENU,
  };

  const FIND_ACCOUNT_LIST = title && mapper[title];

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
      </Wrapper>
      <TabList
        onClick={clickTabHandler}
        selectedTab={selectedTab}
        tabList={FIND_ACCOUNT_LIST ? FIND_ACCOUNT_LIST : MENU_DETAIL_INFORMATION}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: auto;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
  padding: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
      position: absolute;
      left: 24px;
      top: 16px;
    }
  }
`;

export default React.memo(TabHeader);
