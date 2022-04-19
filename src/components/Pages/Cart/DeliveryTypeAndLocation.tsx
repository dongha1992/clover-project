import React from 'react';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import {} from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { isNil, isEqual } from 'lodash-es';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { ILocation } from '@model/index';
import { IGetOrderList } from '@model/index';

interface IProps {
  goToDeliveryInfo: () => void;
  deliveryType?: string;
  deliveryDestination?: ILocation | null;
}

const DeliveryTypeAndLocation = ({ goToDeliveryInfo, deliveryType, deliveryDestination }: IProps) => {
  return (
    <Container onClick={goToDeliveryInfo}>
      <Left>
        <TextH4B>{deliveryType ? DELIVERY_TYPE_MAP[deliveryType.toUpperCase()] : '배송방법과'}</TextH4B>
        <TextH4B>{deliveryDestination ? deliveryDestination?.dong : '배송지를 설정해 주세요'}</TextH4B>
      </Left>
      <Right>
        <SVGIcon name="arrowRight" />
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  cursor: pointer;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  align-self: center;
`;

export default DeliveryTypeAndLocation;
