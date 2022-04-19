import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { textH5 } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { destinationForm, INIT_USER_DELIVERY_TYPE } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@components/Shared/Tooltip';

const SpotHeader = () => {
  const dispatch = useDispatch();
  const { userLocation } = useSelector(destinationForm);
  const goToCart = () => {
    router.push('/cart');
  };

  const goToLocation = (): void => {
    router.push({
      pathname: '/location',
      query: { isSpot: true },
    });
  };

  const goToSpotSearch = () => {
    dispatch(INIT_USER_DELIVERY_TYPE());
    router.push('/spot/search');
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <SVGIcon name="location" />
          <AddressWrapper>
            <div onClick={goToLocation}>
              {userLocation?.emdNm ? <a>{userLocation?.emdNm}</a> : <a>내 위치 설정하기</a>}
            </div>
            {userLocation?.emdNm && (
              <Tooltip
                message='현재 위치가 맞나요?'
                width='139px'
                left='-5px'
                top='29px'
              />
            )}
          </AddressWrapper>
        </Left>
        <Right>
          <div className="search" onClick={goToSpotSearch}>
            <a>
              <SVGIcon name="searchIcon" />
            </a>
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
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  .search {
    padding-right: 27px;
    cursor: pointer;
  }
`;

export default SpotHeader;
