import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton, FlexCol, theme, FlexRow } from '@styles/theme';
import { TextB2R, TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import BorderLine from '@components/Shared/BorderLine';
import getCustomDate from '@utils/getCustomDate';
import { Obj } from '@model/index';

interface IProps {
  title: string;
  selectedSubDelivery: any;
  subDelieryHandler: (deliveryId: number) => void;
}

const SubDeliverySheet = ({ title, selectedSubDelivery, subDelieryHandler }: IProps) => {
  console.log(selectedSubDelivery, 'selectedSubDelivery');
  const [selectedDelivery, setSelectedDelivery] = useState(selectedSubDelivery.id);
  const dispatch = useDispatch();

  const changeRadioHandler = (id: number) => {
    setSelectedDelivery(id);
  };

  const goToNewOrder = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };
  const getSubDeliveryHandler = (deliveryId: number) => {
    dispatch(INIT_BOTTOM_SHEET());
    subDelieryHandler(deliveryId);
  };

  const formatDeliveryInfoToString = (item: any) => {
    const { dayFormatter } = getCustomDate(new Date(item.deliveryDate));
    const deliveryMap: Obj = {
      SPOT: '스팟배송',
      PARCEL: '택배배송',
      MORNING: '새벽배송',
      QUICK: '퀵배송',
    };
    const deliveryTime: Obj = {
      LUNCH: '점심 (11:30-12:00)',
      DINNER: '저녁 (17:30-18:00)',
    };
    const hasDeliveryTime = ['SPOT', 'QUICK'].includes(item.delivery);

    const deliveryInfo = `${
      hasDeliveryTime
        ? `${deliveryMap[item.delivery]} - ${deliveryTime[item.deliveryDetail]}`
        : deliveryMap[item.delivery]
    }`;

    const isSpot = item.delivery === 'SPOT';

    return (
      <FlexCol>
        <TextH5B>
          {dayFormatter} / {deliveryInfo}
        </TextH5B>
        {isSpot ? (
          <TextH5B>
            {item.spotName} - {item.spotPickupName}
          </TextH5B>
        ) : (
          <TextH5B>
            {item.location.addressDetail}-{item.location.addressDetail}
          </TextH5B>
        )}
      </FlexCol>
    );
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {title}
        </TextH5B>
        <TextB2R>배송예정인 기존 주문이 있습니다. 기존 주문과 함께 받아보세요!</TextB2R>
        <BorderLine height={1} margin="16px 0" />
        <FlexRow>
          <RadioButton
            onChange={() => {
              changeRadioHandler(selectedSubDelivery.id);
            }}
            isSelected={selectedDelivery === selectedSubDelivery.id}
          />
          <FlexRow padding="2px 0 0 8px">{formatDeliveryInfoToString(selectedSubDelivery)}</FlexRow>
        </FlexRow>
        <BorderLine height={1} margin="16px 0" />
        <TextH6B padding="0 0 12px 0">함께배송 이용 안내</TextH6B>
        <FlexCol>
          <InfoWrapper>
            <Dot />
            <TextB3R padding="0 0 0 12px" color={theme.brandColor}>
              함께배송은 주문 건당 1회 가능합니다. (주문 취소 시 재주문은 불가합니다.)
            </TextB3R>
          </InfoWrapper>
          <InfoWrapper>
            <Dot />
            <TextB3R padding="0 0 0 12px" color={theme.brandColor}>
              함께배송 최소주문금액은 5,000원입니다.
            </TextB3R>
          </InfoWrapper>
          <InfoWrapper>
            <Dot />
            <TextB3R padding="0 0 0 12px">
              함께배송 주문의 배송정보는 변경할 수 없습니다. (함께배송 주문 완료 후 마이페이지{`>`}주문/배송내역에서
              기존 주문의 배송정보를 변경해주세요)
            </TextB3R>
          </InfoWrapper>
          <InfoWrapper>
            <Dot />
            <TextB3R padding="0 0 0 12px">
              기존 주문 + 현재 주문의 결제액이 무료 배송 기준을 충족하면 기존 주문 시 결제한 배송비는 함께배송되는 현재
              주문금액에서 차감됩니다.
            </TextB3R>
          </InfoWrapper>
          <InfoWrapper>
            <Dot />
            <TextB3R padding="0 0 0 12px">
              기존 주문을 취소하면 함께배송 주문도 취소됩니다. (함께배송 주문을 취소할 경우 기존 주문은 취소되지
              않습니다.)
            </TextB3R>
          </InfoWrapper>
        </FlexCol>
        <BtnWrapper>
          <Button height="100%" width="100%" borderRadius="0" onClick={goToNewOrder}>
            신규 주문하기
          </Button>
          <Col />
          <Button
            height="100%"
            width="100%"
            borderRadius="0"
            onClick={() => getSubDeliveryHandler(selectedSubDelivery.id)}
          >
            함께 배송받기
          </Button>
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 24px;
`;
const Wrapper = styled.div`
  ${homePadding}
`;
const Dot = styled.div`
  height: 4px;
  width: 4px;
  background-color: ${({ theme }) => theme.brandColor};
  border-radius: 50%;
  position: absolute;
  top: 20%;
`;

const InfoWrapper = styled.div`
  position: relative;
`;

const BtnWrapper = styled.div`
  ${bottomSheetButton}
`;

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export default React.memo(SubDeliverySheet);
