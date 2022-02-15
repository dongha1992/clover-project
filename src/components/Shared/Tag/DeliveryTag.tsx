import React from 'react';
import styled, { css } from 'styled-components';
import { TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { Obj } from '@model/index';

type TDeliveryType = 'SPOT' | 'MORNING' | 'PARCEL' | 'QUICK';

interface ITagProps {
  devlieryType: TDeliveryType;
}

const DeliveryTag = ({ devlieryType = 'SPOT' }: ITagProps) => {
  const deliveryMap: Obj = {
    PARCEL: '택배배송',
    MORNING: '새벽배송',
    SPOT: '스팟배송',
    QUICK: '퀵배송',
  };

  const deliveryRenderer = () => {
    switch (devlieryType) {
      case 'SPOT':
        return (
          <SpotWrapper>
            <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
          </SpotWrapper>
        );
      case 'MORNING': {
        return (
          <MorningWrapper>
            <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
          </MorningWrapper>
        );
      }
      case 'PARCEL':
        return (
          <ParcelWrapper>
            <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
          </ParcelWrapper>
        );
      case 'QUICK':
        return (
          <QuickWrapper>
            <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
          </QuickWrapper>
        );
      default:
        return (
          <Container>
            <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
          </Container>
        );
    }
  };

  return deliveryRenderer();
};

const defaultTag = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
`;

const Container = styled(defaultTag)`
  border: 1px solid ${theme.black};
  color: ${theme.black};
`;

const MorningWrapper = styled(defaultTag)`
  border: 1px solid ${theme.morningColor};
  color: ${theme.morningColor};
`;

const ParcelWrapper = styled(defaultTag)`
  border: 1px solid ${theme.parcelColor};
  color: ${theme.parcelColor};
`;

const SpotWrapper = styled(defaultTag)`
  border: 1px solid ${theme.spotColor};
  color: ${theme.spotColor};
`;

const QuickWrapper = styled(defaultTag)`
  border: 1px solid ${theme.quickColor};
  color: ${theme.quickColor};
`;

export default DeliveryTag;
