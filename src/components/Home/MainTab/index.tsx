import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TextH4B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import Image from 'next/image';

const TABS = [
  { title: '카테고리', link: '/category/all' },
  { title: 'HOT썸머 할인!!', link: '/recommendation' },
  { title: '기획전', link: '/' },
  { title: '이벤트', link: '/event' },
];

const MainTab = () => {
  return (
    <Container>
      {TABS.map((tab, index) => {
        return (
          <TabWrapper key={index}>
            <Image
              src={`${process.env.IMAGE_S3_URL}/menu/img_thumbnail_empty.jpg`}
              height="100px"
              width="100px"
              className="rounded"
            />
            <TextH4B padding="12px 0" pointer>
              <Link href={tab.link}>{tab.title}</Link>
            </TextH4B>
          </TabWrapper>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 19px;
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .rounded {
    border-radius: 50%;
  }
`;

export default MainTab;
