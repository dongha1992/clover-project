import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { textH5 } from '@styles/theme';
import Link from 'next/link';
import { breakpoints } from '@utils/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { Tooltip } from '@components/Shared/Tooltip';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';
import { Obj } from '@model/index';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';

const HomeHeader = () => {
  const { userLocation, availableDestination, locationStatus } =
    useSelector(destinationForm);

  const [formatAvailableDestination, setFormatAvailableDestination] =
    useState('');

  const mapper: Obj = {
    morning: { text: '새벽배송이 가능해요!', width: '150px' },
    parcel: { text: '택배배송만 가능해요!', width: '150px' },
    spot: { text: '무료 스팟배송이 가능해요!', width: '170px' },
  };
  console.log(locationStatus, 'locationStatus');

  useEffect(() => {
    setFormatAvailableDestination(locationStatus);
  }, []);

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <SVGIcon name="location" />
          <AddressWrapper>
            <Link href="/location">
              {userLocation?.emdNm ? (
                <a>{userLocation?.emdNm}</a>
              ) : (
                <a>내 위치 찾기</a>
              )}
            </Link>
            {userLocation?.emdNm && (
              <Tooltip
                message={mapper[formatAvailableDestination]?.text}
                width={mapper[formatAvailableDestination]?.width}
              />
            )}
          </AddressWrapper>
        </Left>
        <Right>
          <div className="search">
            <Link href="/search" passHref>
              <a>
                <SVGIcon name="searchIcon" />
              </a>
            </Link>
          </div>
          <CartIcon onClick={goToCart} />
        </Right>
      </Wrapper>
    </Container>
  );
};

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
  align-items: center;
  justify-content: space-between;
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
  display: flex;
  align-items: center;

  .search {
    padding-right: 27px;
  }
`;

export default HomeHeader;
