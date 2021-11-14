import React from 'react';
import { CATEGORY } from '@constants/search';
import styled from 'styled-components';
import Tab from '@components/CategoryTab/Tab';
import { homePadding, theme } from '@styles/theme';

function CategroyTab({ onClick, selectedTab }: any) {
  return (
    <Container>
      <TabWrapper>
        {CATEGORY.map((category, index) => (
          <Tab
            category={category}
            key={index}
            onClick={onClick}
            selectedTab={selectedTab === category.link ? true : false}
          />
        ))}
      </TabWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 48px;
  justify-content: space-between;
  width: auto;
  ${homePadding}
  background-color: ${theme.white};
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default React.memo(CategroyTab);
