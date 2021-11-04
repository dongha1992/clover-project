import React from 'react';
import styled from 'styled-components';
import { textH4 } from '@styles/theme';
const TABS = ['전체메뉴', '프코추천', '이벤트', '기획전', '기획전2'];

function MainTab() {
  return (
    <Container>
      {TABS.map((tab, index) => {
        return <Tab key={tab}>{tab}</Tab>;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 19px;
`;

const Tab = styled.div`
  ${textH4}
  padding: 12px 0px
`;

export default MainTab;
