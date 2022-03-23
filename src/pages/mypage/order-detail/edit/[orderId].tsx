import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexBetween,
  FlexCol,
  FlexRow,
  homePadding,
  fixedBottom,
  FlexColEnd,
  FlexBetweenStart,
} from '@styles/theme';
import { TextH4B, TextH5B, TextB2R, TextB3R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import SVGIcon from '@utils/SVGIcon';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { getDestinations, editDestination, deleteDestinations } from '@api/destination';
import { getOrderDetailApi } from '@api/order';
import { IDestinationsResponse } from '@model/index';
import router from 'next/router';
import { ACCESS_METHOD_PLACEHOLDER, ACCESS_METHOD, DELIVERY_TYPE_MAP } from '@constants/payment';
import { IAccessMethod } from '@pages/payment';
import { commonSelector } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { useQuery, useQueryClient } from 'react-query';
import { destinationForm, INIT_TEMP_DESTINATION, SET_USER_DESTINATION_STATUS } from '@store/destination';
import { pipe, indexBy } from '@fxts/core';
import { Obj } from '@model/index';
interface IProps {
  orderId: number;
}

const DELIVERY_DETAIL_MAP: Obj = {
  LUNCH: '점심',
  DINNER: '저녁',
};

const OrderDetailAddressEditPage = ({ orderId }: IProps) => {
  const [selectedAddress, setSelectedAddress] = useState<IDestinationsResponse>();
  const [selectedAccessMethod, setSelectedAccessMethod] = useState<IAccessMethod | undefined>(undefined);
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [deliveryEditObj, setDeliveryEditObj] = useState<any>({
    selectedMethod: {},
    deliveryMessageType: '',
    receiverTel: '',
    receiverName: '',
    deliveryMessage: '',
  });

  const dispatch = useDispatch();
  const { userAccessMethod } = useSelector(commonSelector);
  const { userTempDestination } = useSelector(destinationForm);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    'getOrderDetail',
    async () => {
      const { data } = await getOrderDetailApi(orderId);
      return data.data;
    },
    {
      onSuccess: (data) => {
        const orderDetail = data?.orderDeliveries[0];

        const userAccessMethodMap = pipe(
          ACCESS_METHOD,
          indexBy((item) => item.value)
        );

        setDeliveryEditObj({
          selectedMethod: userAccessMethodMap[orderDetail?.deliveryMessageType!],
          deliveryMessageType: orderDetail?.deliveryMessageType!,
          deliveryMessage: orderDetail?.deliveryMessage!,
          receiverName: orderDetail?.receiverName!,
          receiverTel: orderDetail?.receiverTel!,
        });
      },
      onSettled: async () => {},

      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const orderDetail = data?.orderDeliveries[0];

  const isParcel = orderDetail?.delivery === 'PARCEL';
  const isSpot = orderDetail?.delivery === 'SPOT';
  const isMorning = orderDetail?.delivery === 'MORNING';

  const checkSamePerson = () => {
    setIsSamePerson((prev) => !prev);
  };

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
    console.log(selectedAddress);

    dispatch(INIT_TEMP_DESTINATION());
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

  const changeDeliveryPlace = () => {
    if (isSpot) {
      router.push({ pathname: '/spot/search', query: { orderId } });
    } else {
      router.push({ pathname: '/destination/search', query: { orderId } });
      dispatch(SET_USER_DESTINATION_STATUS(orderDetail?.delivery.toLowerCase()!));
    }
  };

  useEffect(() => {
    /* TODO : 출입방법 선택하는 거 로직 너무 드러움 */
    setDeliveryEditObj({
      ...deliveryEditObj,
      selectedMethod: userAccessMethod,
    });
  }, [userAccessMethod]);

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
              value={isSamePerson ? orderDetail?.receiverName : deliveryEditObj?.receiverName}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput
              placeholder="휴대폰 번호"
              name="receiverTel"
              value={isSamePerson ? orderDetail?.receiverTel : deliveryEditObj?.receiverTel}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <FlexBetween>
              <TextH4B>{isSpot ? '픽업지' : '배송지'}</TextH4B>
              <TextH6B color={theme.greyScale65} onClick={changeDeliveryPlace} textDecoration="underLine">
                배송지 변경
              </TextH6B>
            </FlexBetween>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>배송방법</TextH5B>
            {isSpot ? (
              <TextB2R>
                {`${DELIVERY_TYPE_MAP[orderDetail?.delivery!]} - ${DELIVERY_DETAIL_MAP[orderDetail?.deliveryDetail!]}`}
              </TextB2R>
            ) : (
              <TextB2R>{DELIVERY_TYPE_MAP[orderDetail?.delivery!]}</TextB2R>
            )}
          </FlexBetween>
          {isSpot ? (
            <FlexBetweenStart padding="16px 0 0 0">
              <TextH5B>픽업장소</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {orderDetail?.location?.addressDetail} {orderDetail?.spotPickup?.name!}
                </TextB2R>
                <FlexRow>
                  <TextB3R color={theme.greyScale65} padding="0 4px 0 0">
                    ({orderDetail?.location?.zipCode})
                  </TextB3R>
                  <TextB3R color={theme.greyScale65}>{orderDetail?.location?.address}</TextB3R>
                </FlexRow>
              </FlexColEnd>
            </FlexBetweenStart>
          ) : (
            <FlexBetweenStart padding="16px 0 0 0">
              <TextH5B>배송지</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {userTempDestination ? userTempDestination.location.address : orderDetail?.location?.address}
                </TextB2R>
                <TextB2R>
                  {userTempDestination
                    ? userTempDestination.location.addressDetail
                    : orderDetail?.location?.addressDetail}
                </TextB2R>
              </FlexColEnd>
            </FlexBetweenStart>
          )}
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isMorning && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>{deliveryEditObj?.selectedMethod.text || '출입방법 선택'}</TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[deliveryEditObj.deliveryMessageType]
                    ? ACCESS_METHOD_PLACEHOLDER[deliveryEditObj.deliveryMessageType]
                    : '요청사항을 입력해주세요'
                }
                margin="8px 0 0 0"
                value={deliveryEditObj?.deliveryMessage || ''}
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
