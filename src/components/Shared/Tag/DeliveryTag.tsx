import React from 'react';
import styled, { css } from 'styled-components';
import { TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { Obj } from '@model/index';

type TDeliveryType = 'SPOT' | 'MORNING' | 'PARCEL' | 'QUICK';

interface ITagProps {
  devlieryType: TDeliveryType;
  margin?: string;
}

const DeliveryTag = ({ devlieryType, margin }: ITagProps) => {
  const deliveryMap: Obj = {
    PARCEL: '택배배송',
    MORNING: '새벽배송',
    SPOT: '스팟배송',
    QUICK: '퀵배송',
  };

  return (
    <Container devlieryType={devlieryType} margin={margin}>
      <TextH7B>{deliveryMap[devlieryType]}</TextH7B>
    </Container>
  );
};

const Container = styled.div<{ devlieryType: TDeliveryType; margin?: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin: ${({ margin }) => margin && margin};
  text-align: center;

  ${({ devlieryType }) => {
    if (devlieryType === 'SPOT') {
      return css`
        border: 1px solid ${theme.spotColor};
        color: ${theme.spotColor};
      `;
    } else if (devlieryType === 'MORNING') {
      return css`
        border: 1px solid ${theme.morningColor};
        color: ${theme.morningColor};
      `;
    } else if (devlieryType === 'PARCEL') {
      return css`
        border: 1px solid ${theme.parcelColor};
        color: ${theme.parcelColor};
      `;
    } else {
      return css`
        border: 1px solid ${theme.quickColor};
        color: ${theme.quickColor};
      `;
    }
  }}
`;

export default DeliveryTag;
