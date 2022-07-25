import React from 'react';
import styled, { css } from 'styled-components';
import Tab from '@components/Shared/TabList/Tab';
import { homePadding, theme } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';

const StickyTab = ({ tabList, onClick, selectedTab, isSticky, countObj }: any) => {
  return (
    <Container isSticky={isSticky}>
      <TabWrapper>
        {tabList.map((tabItem: any, index: number) => (
          <Tab
            tabItem={tabItem}
            key={index}
            onClick={onClick}
            selectedTab={selectedTab === tabItem.link ? true : false}
            countObj={countObj}
          />
        ))}
      </TabWrapper>
    </Container>
  );
};

const Container = styled.div<{ isSticky: boolean }>`
  display: flex;

  ${({ isSticky, theme }) => {
    if (isSticky && theme.desktop) {
      return css`
        position: fixed;
        top: 56px;
        width: 100%;
        max-width: ${breakpoints.mobile}px;
        box-shadow: -1px 9px 16px -4px rgb(0 0 0 / 25%);
      `;
    }
  }}
  height: 48px;
  justify-content: space-between;
  width: 100%;
  background-color: ${theme.white};
  z-index: 100000;
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

export default React.memo(StickyTab);
