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
  const [selectedTab, setSelectedTab] = useState<string>('/category');
  const router = useRouter();

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  const goBack = (): void => {
    router.back();
  };

  const clickTabHandler = useCallback(
    (category: any) => {
      setSelectedTab(category.title);
      router.push(`${category.link}`);
    },
    [router]
  );

  const goToCart = () => {};

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <div className="cart" onClick={goToCart}>
          <SVGIcon name="cart" />
        </div>
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
  height: auto;
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
  justify-content: space-between;
  padding: 14px 27px;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

export default React.memo(CategorySubHeader);
