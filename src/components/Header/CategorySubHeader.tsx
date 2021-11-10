import React, { useEffect, useState, useCallback } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Text';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

const CategroyTab = dynamic(() => import('../CategoryTab'));

type TProps = {
  title?: string;
};

function CategorySubHeader({ title }: TProps) {
  const [selectedTab, setSelectedTab] = useState<string>('전체');
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const clickTabHandler = (category: string) => {
    setSelectedTab(category);
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
      </Wrapper>
      <CategroyTab onClick={clickTabHandler} selectedTab={selectedTab} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 504px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50% + 27px);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  .arrow {
    cursor: pointer;
    > svg {
      position: absolute;
      left: 24px;
      bottom: 16px;
    }
  }
`;

export default React.memo(CategorySubHeader);
