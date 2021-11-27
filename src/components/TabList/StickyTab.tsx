import React from 'react';
import styled, { css } from 'styled-components';
import Tab from '@components/TabList/Tab';
import { homePadding, theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';

function StickyTab({
  tabList,
  onClick,
  selectedTab,
  numebrOfReview,
  isSticky,
}: any) {
  return (
    <Container isSticky={isSticky}>
      <TabWrapper>
        {tabList.map((tabItem: any, index: number) => (
          <Tab
            tabItem={tabItem}
            key={index}
            onClick={onClick}
            selectedTab={selectedTab === tabItem.link ? true : false}
            numebrOfReview={numebrOfReview}
          />
        ))}
      </TabWrapper>
    </Container>
  );
}

const Container = styled.div<{ isSticky: boolean }>`
  display: flex;

  ${({ isSticky, theme }) => {
    if (isSticky && theme.desktop) {
      return css`
        position: fixed;
        top: 56px;
        width: 100%;
        max-width: ${breakpoints.mobile}px;
      `;
    }
  }}
  height: 48px;
  justify-content: space-between;
  width: 100%;
  ${homePadding}
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
