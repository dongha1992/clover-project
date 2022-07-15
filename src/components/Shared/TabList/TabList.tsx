import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import Tab from '@components/Shared/TabList/Tab';
import { theme } from '@styles/theme';
import { useSelector, useDispatch } from 'react-redux';
import { commonSelector } from '@store/common';
import useScrollCheck from '@hooks/useScrollCheck';

const TabList = ({ onClick, selectedTab, tabList, countObj }: any, ref: any) => {
  // const { isScroll } = useSelector(commonSelector);
  const isScroll = useScrollCheck();

  return (
    <Container scroll={isScroll}>
      <TabWrapper ref={ref}>
        {tabList.map((tabItem: any, index: number) => {
          const defaulUrl = selectedTab === tabItem.link;

          return (
            <Tab
              tabItem={tabItem}
              key={index}
              onClick={onClick}
              selectedTab={selectedTab === tabItem.link ? true : false}
              countObj={countObj}
            />
          );
        })}
      </TabWrapper>
    </Container>
  );
};

const Container = styled.div<{ scroll: boolean }>`
  display: flex;
  height: 48px;
  justify-content: space-between;
  width: 100%;
  background-color: ${theme.white};
  ${({ scroll }) => {
    if (scroll) {
      return css`
        //filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
      `;
    }
  }}
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default React.memo(React.forwardRef(TabList));
