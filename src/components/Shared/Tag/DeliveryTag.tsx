import React from 'react';
import styled, { css } from 'styled-components';
import { TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { Obj } from '@model/index';

type TDeliveryType = 'SPOT' | 'MORNING' | 'PARCEL' | 'QUICK';

interface ITagProps {
  deliveryType?: TDeliveryType | string;
  margin?: string;
}

const DeliveryTag = ({ deliveryType, margin }: ITagProps) => {
  const deliveryMap: Obj = {
    PARCEL: '택배배송',
    MORNING: '새벽배송',
    SPOT: '스팟배송',
    QUICK: '퀵배송',
  };

  const setFontColor = () => {
    if (deliveryType === 'SPOT') {
      return `${theme.brandColor}`;
    } else if (deliveryType === 'MORNING') {
      return `${theme.morningColor}`;
    } else if (deliveryType === 'PARCEL') {
      return `${theme.parcelColor}`;
    } else {
      return `${theme.quickColor}`;
    };
  };

  return (
    <Container deliveryType={deliveryType!} margin={margin}>
      <TextH7B color={setFontColor()}>{deliveryMap[deliveryType!]}</TextH7B>
    </Container>
  );
};

const Container = styled.div<{ deliveryType: TDeliveryType | string; margin?: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin: ${({ margin }) => margin && margin};
  text-align: center;

  ${({ deliveryType }) => {
    if (deliveryType === 'SPOT') {
      return css`
        border: 1px solid ${theme.brandColor};
      `;
    } else if (deliveryType === 'MORNING') {
      return css`
        border: 1px solid ${theme.morningColor};
      `;
    } else if (deliveryType === 'PARCEL') {
      return css`
        border: 1px solid ${theme.parcelColor};
      `;
    } else {
      return css`
        border: 1px solid ${theme.quickColor};
      `;
    }
  }}
`;

export default DeliveryTag;
