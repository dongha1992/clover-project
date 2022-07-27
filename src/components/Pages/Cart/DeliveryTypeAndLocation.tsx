import React from 'react';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { isNil, isEqual } from 'lodash-es';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { ILocation, IGetOrderList, IDeliveryObj } from '@model/index';

interface IProps {
  goToDeliveryInfo: () => void;
  deliveryType?: string;
  deliveryDestination?: IDeliveryObj | null;
}

const DeliveryTypeAndLocation = ({ goToDeliveryInfo, deliveryType, deliveryDestination }: IProps) => {
  const isSpot = deliveryType === 'spot';
  const isNotSpot = ['parcel', 'morning', 'quick'].includes(deliveryType!);

  const renderDestinationInfo = (): string => {
    switch (true) {
      case isSpot: {
        return `${deliveryDestination?.name}`;
      }

      case isNotSpot && deliveryDestination?.location !== null: {
        return `${deliveryDestination?.location?.address} ${deliveryDestination?.location?.addressDetail} `;
      }
      default:
        return '배송지를 설정해 주세요';
    }
  };
  return (
    <Container onClick={goToDeliveryInfo}>
      <Left>
        <TextH4B>{deliveryType ? DELIVERY_TYPE_MAP[deliveryType.toUpperCase()] : '배송방법과'}</TextH4B>
        <TextH4B>{renderDestinationInfo()}</TextH4B>
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
