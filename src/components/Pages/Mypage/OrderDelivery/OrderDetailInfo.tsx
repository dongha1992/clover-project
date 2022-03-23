import React from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexBetweenStart, FlexColEnd, FlexEnd } from '@styles/theme';
import { TextH4B, TextB3R, TextB2R, TextH5B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { ACCESS_METHOD_VALUE } from '@constants/payment';
interface IProps {
  receiverName: string;
  receiverTel: string;
  deliveryAt: string;
  delivery: string;
  deliveryDetail?: string;
  location: {
    address: string;
    addressDetail: string;
    dong: string;
    zipCode: string;
  };
  status: string;
  deliveryMessage?: string;
  deliveryMessageType?: string;
  spotName?: string;
  spotPickupName?: string;
}

const OrderDetailInfo = ({
  receiverName,
  receiverTel,
  deliveryAt,
  delivery,
  location,
  status,
  deliveryDetail,
  deliveryMessage,
  deliveryMessageType,
  spotName,
  spotPickupName,
}: IProps) => {
  const isSpot = delivery === '스팟배송';
  const isParcel = delivery === '택배배송';
  const isMorning = delivery === '새벽배송';

  const DELIVERTY_DETAIL_MAP: Obj = {
    LUNCH: '11:30-12:00',
    DIINER: '18:00-18:30',
  };

  return (
    <FlexCol margin="0 0 24px 0">
      <FlexBetween>
        <TextH4B>배송정보</TextH4B>
      </FlexBetween>
      <FlexCol padding="24px 0 0 0">
        <FlexBetween>
          <TextH5B>받는 사람</TextH5B>
          <TextB2R>{receiverName}</TextB2R>
        </FlexBetween>
        <FlexBetween margin="16px 0 0 0">
          <TextH5B>휴대폰 번호</TextH5B>
          <TextB2R>{receiverTel}</TextB2R>
        </FlexBetween>
        <FlexBetween margin="16px 0 0 0">
          <TextH5B>배송방법</TextH5B>
          <TextB2R>
            {delivery} {deliveryDetail ? '-' + deliveryDetail : null}
          </TextB2R>
        </FlexBetween>
        <FlexBetweenStart margin="16px 0 24px 0">
          <TextH5B>배송 예정실시</TextH5B>
          <FlexColEnd>
            <TextB2R>
              {deliveryAt} {deliveryDetail && DELIVERTY_DETAIL_MAP[deliveryDetail]}
            </TextB2R>
            <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
            <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
          </FlexColEnd>
        </FlexBetweenStart>
        <FlexBetweenStart>
          <TextH5B>{isSpot ? '픽업장소' : '배송지'}</TextH5B>
          {isSpot ? (
            <FlexColEnd>
              <TextB2R>
                {spotName} {spotPickupName}
              </TextB2R>
              <TextB3R color={theme.greyScale65}>
                ({location.zipCode}) {location.address}
              </TextB3R>
            </FlexColEnd>
          ) : (
            <FlexColEnd>
              <TextB2R>{location.address}</TextB2R>
              <TextB2R>{location.addressDetail}</TextB2R>
            </FlexColEnd>
          )}
        </FlexBetweenStart>
        {isParcel && (
          <FlexBetweenStart margin="16px 0 24px 0">
            <TextH5B>배송메모</TextH5B>
            <FlexColEnd>
              <TextB2R>{deliveryMessage}</TextB2R>
            </FlexColEnd>
          </FlexBetweenStart>
        )}
        {isMorning && (
          <FlexBetweenStart margin="16px 0 24px 0">
            <TextH5B>출입방법</TextH5B>
            <FlexColEnd>
              <TextB2R>{deliveryMessageType && ACCESS_METHOD_VALUE[deliveryMessageType]}</TextB2R>
              <TextB2R>{deliveryMessage}</TextB2R>
            </FlexColEnd>
          </FlexBetweenStart>
        )}
      </FlexCol>
    </FlexCol>
  );
};

export default OrderDetailInfo;
