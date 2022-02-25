import React from 'react';
import styled from 'styled-components';
import Tab from '@components/Shared/TabList/Tab';
import { theme } from '@styles/theme';

const TabList = ({ onClick, selectedTab, tabList, countObj }: any, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <Container ref={ref}>
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

const Container = styled.div`
  display: flex;
  height: 48px;
  justify-content: space-between;
  width: 100%;
  background-color: ${theme.white};
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
