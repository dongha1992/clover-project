import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { textH5 } from '@styles/theme';
import Link from 'next/link';
import { breakpoints } from '@utils/getMediaQuery';

function HomeHeader() {
  return (
    <Container>
      <Wrapper>
        <Left>
          <SVGIcon name="location" />
          <AddressWrapper>
            <Link href="/location">
              <a>내 위치 찾기</a>
            </Link>
          </AddressWrapper>
        </Left>
        <Right>
          <div>
            <Link href="/search" passHref>
              <a>
                <SVGIcon name="searchIcon" />
              </a>
            </Link>
          </div>
          <SVGIcon name="cart" />
        </Right>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1))
    drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  margin: 16px 24px;
`;

const AddressWrapper = styled.div`
  ${textH5}
  padding-left: 8px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 10px;
  > div {
    padding-right: 24px;
  }
`;

export default HomeHeader;
