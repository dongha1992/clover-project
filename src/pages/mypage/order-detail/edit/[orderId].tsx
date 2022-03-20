import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, FlexBetween, FlexCol, FlexRow, homePadding, fixedBottom, FlexColEnd } from '@styles/theme';
import { TextH4B, TextH5B, TextB2R, TextB3R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { ACCESS_METHOD } from '@constants/payment/index';
import SVGIcon from '@utils/SVGIcon';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { getDestinations, editDestination, deleteDestinations } from '@api/destination';
import { getOrderDetailApi } from '@api/order';
import { IDestinationsResponse } from '@model/index';
import { Obj } from '@model/index';
import router from 'next/router';
import { getValues } from '@utils/getValues';
import { ACCESS_METHOD_PLACEHOLDER } from '@constants/payment';
import { IAccessMethod } from '@pages/payment';
import { commonSelector } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { DELIVERY_TYPE_MAP } from '@constants/payment/index';
import { useQuery } from 'react-query';

interface IProps {
  orderId: number;
}

const OrderDetailAddressEditPage = ({ orderId }: IProps) => {
  const [selectedAddress, setSelectedAddress] = useState<IDestinationsResponse>();
  const [selectedAccessMethod, setSelectedAccessMethod] = useState<IAccessMethod>();
  const [isSamePerson, setIsSamePerson] = useState(false);
  const [isDefaultSpot, setIsDefaultSpot] = useState(false);
  const [deliveryEditObj, setDeliveryEditObj] = useState({
    deliveryName: '',
    receiverTel: '',
    receiverName: '',
    deliveryMessage: '',
  });

  const dispatch = useDispatch();
  const { userAccessMethod } = useSelector(commonSelector);

  const { data: orderDetail, isLoading } = useQuery(
    'getOrderDetail',
    async () => {
      const { data } = await getOrderDetailApi(orderId);
      console.log(data.data, 'data.data');
      return data.data.orderDeliveries[0] || {};
    },
    {
      onSuccess: (data) => {},

      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  console.log(orderDetail, 'orderDetail');

  const isParcel = selectedAddress?.delivery === 'PARCEL';
  const isSpot = selectedAddress?.delivery === 'SPOT';
  const isMorning = selectedAddress?.delivery === 'MORNING';

  const getDeliveryInfo = async () => {};

  const checkSamePerson = () => {};

  const editDeliveryInfoHandler = () => {
    if (!cheekBeforeEdit()) {
      return;
    }

    dispatch(
      SET_ALERT({
        alertMessage: '내용을 수정했습니다.',
        onSubmit: () => editDeliveryInfo(),
        submitBtnText: '확인',
      })
    );
  };

  const cheekBeforeEdit = (): boolean => {
    const noMsg = !deliveryEditObj.deliveryMessage.length;
    const noAccessMethod = !selectedAccessMethod?.value!;

    switch (true) {
      case isMorning: {
        if (noMsg) {
          dispatch(SET_ALERT({ alertMessage: '메시지를 입력해주세요.' }));
          return false;
        } else if (noAccessMethod) {
          dispatch(SET_ALERT({ alertMessage: '츨입방법을 입력해주세요' }));
          return false;
        } else {
          return true;
        }
      }

      case isParcel: {
        if (noMsg) {
          dispatch(SET_ALERT({ alertMessage: '메시지를 입력해주세요.' }));
          return false;
        } else {
          return true;
        }
      }

      default: {
        return true;
      }
    }
  };

  const editDeliveryInfo = async () => {
    const reqBody = {};
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setDeliveryEditObj({ ...deliveryEditObj, [name]: value });
  };

  const selectAccessMethodHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
      })
    );
  };

  useEffect(() => {
    getDeliveryInfo();
  }, []);

  useEffect(() => {
    setSelectedAccessMethod(userAccessMethod);
  }, [userAccessMethod]);

  // const placeInfoRender = (deliveryType: string) => {
  //   switch (deliveryType) {
  //     case 'SPOT': {
  //       return (
  //         <PickupPlaceBox
  //           place={orderDetail?.location}
  //           checkTermHandler={setIsDefaultSpot}
  //           isSelected={isDefaultSpot}
  //         />
  //       );
  //     }

  //     default: {
  //       return <DeliveryPlaceBox place={orderDetail?.location} type={orderDetail?.delivery!} />;
  //     }
  //   }
  // };

  return (
    <Container>
      <Wrapper>
        <ReceiverInfoWrapper>
          <FlexBetween>
            <TextH4B>받는 사람 정보</TextH4B>
            <FlexRow>
              <Checkbox onChange={checkSamePerson} isSelected={isSamePerson} />
              <TextB2R padding="0 0 0 8px">주문자와 동일</TextB2R>
            </FlexRow>
          </FlexBetween>
          <FlexCol padding="24px 0">
            <TextH5B padding="0 0 8px 0">이름</TextH5B>
            <TextInput
              placeholder="이름"
              name="receiverName"
              value={deliveryEditObj?.receiverName}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput
              placeholder="휴대폰 번호"
              name="receiverTel"
              value={deliveryEditObj?.receiverTel}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <TextH4B>{isSpot ? '픽업지' : '배송지'}</TextH4B>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>배송방법</TextH5B>
            <TextB2R></TextB2R>
          </FlexBetween>
          <FlexBetween padding="16px 0 0 0">
            <TextH5B>배송지</TextH5B>
            <FlexColEnd>
              <TextB2R>{orderDetail.address}</TextB2R>
              <TextB2R>{orderDetail.addressDetail}</TextB2R>
            </FlexColEnd>
          </FlexBetween>
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isMorning && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>{selectedAccessMethod?.text || '출입방법 선택'}</TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[selectedAccessMethod?.value!]
                    ? ACCESS_METHOD_PLACEHOLDER[selectedAccessMethod?.value!]
                    : '요청사항 입력'
                }
                margin="8px 0 0 0"
                value={deliveryEditObj?.deliveryMessage}
                eventHandler={changeInputHandler}
              />
            </FlexCol>
            <MustCheckAboutDelivery>
              <FlexCol>
                <FlexRow padding="0 0 8px 0">
                  <SVGIcon name="exclamationMark" />
                  <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
                    반드시 확인해주세요!
                  </TextH6B>
                </FlexRow>
                <TextB3R color={theme.brandColor}>
                  공동현관 및 무인택배함 비밀번호는 조합 방식 및 순서(#,호출버튼)와 함께 자세히 기재해주세요.
                </TextB3R>
              </FlexCol>
            </MustCheckAboutDelivery>
          </VisitorAccessMethodWrapper>
        )}
        {isParcel && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>배송 메모</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <TextInput
                name="deliveryMessage"
                placeholder="요청사항 입력"
                margin="8px 0 0 0"
                value={deliveryEditObj?.deliveryMessage}
                eventHandler={changeInputHandler}
              />
            </FlexCol>
          </VisitorAccessMethodWrapper>
        )}
      </Wrapper>
      <BtnWrapper>
        <Button height="100%" width="100%" borderRadius="0" onClick={editDeliveryInfoHandler}>
          변경하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  padding-top: 24px;
`;

const ReceiverInfoWrapper = styled.div`
  ${homePadding}
`;
const DevlieryInfoWrapper = styled.div`
  ${homePadding}
`;

const AccessMethodWrapper = styled.div`
  border: 1px solid ${theme.greyScale15};
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VisitorAccessMethodWrapper = styled.div`
  padding: 24px;
`;

const MustCheckAboutDelivery = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
  display: flex;
`;

export async function getServerSideProps(context: any) {
  const { orderId } = context.query;

  return {
    props: { orderId: Number(orderId) },
  };
}
export default OrderDetailAddressEditPage;
