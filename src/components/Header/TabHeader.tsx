import React, { useEffect, useState, useCallback } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { MENU_DETAIL_INFORMATION } from '@constants/menu';
import { FIND_ACCOUNT } from '@constants/login';
import { DIB_MENU } from '@constants/mypage';
import dynamic from 'next/dynamic';
import { breakpoints } from '@utils/getMediaQuery';
import { TextH4B } from '@components/Shared/Text';
import { Obj } from '@model/index';

const TabList = dynamic(() => import('../Shared/TabList/TabList'));

type TProps = {
  title?: string;
};

/* TODO: 뒤로가기 시 replace로 교체 */

const TabHeader = ({ title }: TProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    '/login/find-account/email'
  );

  const router = useRouter();

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  const goBack = (): void => {
    /* TODO: 맵핑해서 router 변경 조건 만들어야함 */
    if (
      router.asPath === '/login/find-account/password' ||
      router.asPath === '/login/find-account/email'
    ) {
      router.push('/login');
    } else {
      router.back();
    }
  };

  const clickTabHandler = useCallback(
    (tabItem: any) => {
      setSelectedTab(tabItem.text);
      router.push(`${tabItem.link}`);
    },
    [router]
  );

  const mapper: Obj = {
    '아이디/비밀번호 찾기': FIND_ACCOUNT,
    '찜 관리': DIB_MENU,
  };

  const data = title && mapper[title];

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
        tabList={data ? data : MENU_DETAIL_INFORMATION}
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