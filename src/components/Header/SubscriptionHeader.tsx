import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';
import router from 'next/router';
import { SVGIcon } from '@utils/common';
import { TextH5B } from '@components/Shared/Text';
import { Tooltip } from '@components/Shared/Tooltip';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { useEffect, useState } from 'react';
import { Obj } from '@model/index';

const mapper: Obj = {
  morning: { text: '새벽배송이 가능해요!', width: '150px' },
  parcel: { text: '택배배송만 가능해요!', width: '150px' },
  spot: { text: '무료 스팟배송이 가능해요!', width: '170px' },
};

const SubscriptionHeader = () => {
  const [formatAvailableDestination, setFormatAvailableDestination] = useState('');
  const { userLocation, locationStatus } = useSelector(destinationForm);

  useEffect(() => {
    setFormatAvailableDestination(locationStatus);
  }, []);

  const goToSubsInformation = () => {
    router.push('/subscription/information');
  };

  const goToLocation = () => {
    router.push({
      pathname: '/location',
      query: { isSub: true },
    });
  };

  return (
    <Container>
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
        <Button onClick={goToSubsInformation}>구독안내</Button>
      </Wrapper>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  cursor: pointer;

  height: 26px;
  padding-top: 3px;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.brandColor};
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
  letter-spacing: -0.4px;
  border-radius: 24px;
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

export default SubscriptionHeader;
