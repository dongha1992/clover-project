import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TextH4B } from '@components/Text';
const TABS = [
  { title: '전체메뉴', link: '/menu' },
  { title: '프코추천', link: '/recommendation' },
  { title: '이벤트', link: '/' },
  { title: '기획전', link: '/' },
  { title: '기획전2', link: '/' },
];

function MainTab() {
  return (
    <Container>
      {TABS.map((tab, index) => {
        return (
          <Link href={tab.link} key={index}>
            <TextH4B padding="12px 0" pointer>
              {tab.title}
            </TextH4B>
          </Link>
        );
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

export default MainTab;
