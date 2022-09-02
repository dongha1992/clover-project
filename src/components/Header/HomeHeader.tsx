import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SVGIcon } from '@utils/common';
import { TextH5B } from '@components/Shared/Text';
import Link from 'next/link';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { Tooltip } from '@components/Shared/Tooltip';
import { Obj } from '@model/index';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { bottomSheetForm } from '@store/bottomSheet';

const mapper: Obj = {
  morning: { text: '새벽배송이 가능해요!', width: '150px' },
  parcel: { text: '택배배송만 가능해요!', width: '150px' },
  spot: { text: '무료 스팟배송이 가능해요!', width: '180px' },
};

const HomeHeader = () => {
  const [formatAvailableDestination, setFormatAvailableDestination] = useState('');
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const { userLocation, locationStatus } = useSelector(destinationForm);

  const { content }: any = useSelector(bottomSheetForm);

  useEffect(() => {
    setFormatAvailableDestination(locationStatus);
  }, []);

  const goToCart = () => {
    router.push('/cart');
  };

  const goToLocation = () => {
    router.push('/location');
  };

  useEffect(() => {
    setIsBottomSheet(content ? true : false);
  }, [content]);

  return (
    <Container isBottomSheet={isBottomSheet}>
      <Wrapper>
        <Left onClick={goToLocation}>
          <SVGIcon name="location" />
          <AddressWrapper>
            <TextH5B>{userLocation?.emdNm ? <a>{userLocation?.emdNm}</a> : <a>내 위치 설정하기</a>}</TextH5B>
            {userLocation?.emdNm && formatAvailableDestination && (
              <Tooltip
                message={mapper[formatAvailableDestination]?.text}
                width={mapper[formatAvailableDestination]?.width}
                left="-8px"
                top="30px"
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

const Container = styled.div<{ isBottomSheet?: boolean }>`
  width: 100%;
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ isBottomSheet }) => {
    if (!isBottomSheet) {
      return css`
        // filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
      `;
    } else {
      return css``;
    }
  }}
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin: 16px 24px; */
`;

const AddressWrapper = styled.div`
  padding-left: 8px;
`;

const Left = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  .search {
    padding-right: 27px;
  }
`;

export default HomeHeader;
