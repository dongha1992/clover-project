import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TextH4B, TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import Image from 'next/image';
import { useRouter } from 'next/router';

const TABS = [
  { title: '카테고리', link: '/category/all' },
  { title: 'HOT썸머 할인', link: '/recommendation' },
  { title: '기획전', link: '/' },
  { title: '이벤트·소식', link: '/event' },
];

const MainTab = () => {
  const router = useRouter();
  return (
    <Container>
      {TABS.map((tab, index) => {
        return (
          <TabWrapper key={index} onClick={() => router.push(`${tab.link}`)}>
            <Image
              src={`${process.env.IMAGE_S3_URL}/menu/img_thumbnail_empty.jpg`}
              height="80px"
              width="80px"
              className="rounded"
            />
            <TextB2R padding="12px 0" pointer>
              {tab.title}
            </TextB2R>
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

  cursor: pointer;
  .rounded {
    border-radius: 50%;
  }
`;

export default MainTab;
