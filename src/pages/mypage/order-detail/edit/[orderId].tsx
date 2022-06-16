import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { SVGIcon } from '@utils/common';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { getOrderDetailApi, editDeliveryDestinationApi, editSpotDestinationApi } from '@api/order';
import router from 'next/router';
import { ACCESS_METHOD_PLACEHOLDER, ACCESS_METHOD, DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/order';
import { commonSelector, INIT_ACCESS_METHOD } from '@store/common';
import { mypageSelector, INIT_TEMP_ORDER_INFO, SET_TEMP_ORDER_INFO, INIT_TEMP_EDIT_DESTINATION } from '@store/mypage';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { destinationForm, SET_USER_DELIVERY_TYPE } from '@store/destination';
import { pipe, indexBy } from '@fxts/core';
import { Obj } from '@model/index';
import debounce from 'lodash-es/debounce';

/* TODO: 서버/store 값 state에서 통일되게 관리, spot 주소쪽 */
interface IProps {
  orderId: number;
}

const OrderDetailAddressEditPage = ({ orderId }: IProps) => {
  const { userAccessMethod } = useSelector(commonSelector);
  const { tempEditDestination, tempEditSpot, tempOrderInfo } = useSelector(mypageSelector);

  const [isSamePerson, setIsSamePerson] = useState(tempOrderInfo?.isSamePerson);
  const [deliveryEditObj, setDeliveryEditObj] = useState<any>({
    selectedMethod: {},
    location: {},
    deliveryMessageType: '',
    deliveryMessage: '',
    receiverTel: '',
    receiverName: '',
  });

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['getOrderDetail'],
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
          receiverName: tempOrderInfo?.receiverName ? tempOrderInfo?.receiverName : orderDetail?.receiverName!,
          receiverTel: tempOrderInfo?.receiverTel ? tempOrderInfo?.receiverTel : orderDetail?.receiverTel!,
          location: tempEditDestination?.location ? tempEditDestination.location : orderDetail?.location,
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

  const { mutateAsync: mutationDeliveryInfo } = useMutation(
    async (reqBody: any) => {
      const deliveryId = orderDetail?.id!;

      if (!isSpot) {
        const { selectedMethod, ...rest } = reqBody;
        const { data } = await editDeliveryDestinationApi({
          deliveryId,
          data: { ...rest },
        });
      } else {
        const { data } = await editSpotDestinationApi({
          deliveryId,
          data: {
            receiverName: deliveryEditObj.receiverName,
            receiverTel: deliveryEditObj.receiverTel,
            spotPickupId: tempEditSpot?.spotPickupId ? +tempEditSpot?.spotPickupId : orderDetail?.spotPickupId!,
          },
        });
      }
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getOrderDetail');
        dispatch(INIT_TEMP_EDIT_DESTINATION());
      },
      onError: async (error: any) => {
        if (error.code === 5001) {
          dispatch(SET_ALERT({ alertMessage: '잘못된 배송상태입니다.' }));
        }
      },
    }
  );

  const checkSamePerson = () => {
    setIsSamePerson((prev) => !prev);
  };

  const editDeliveryInfoHandler = () => {
    if (!checkBeforeEdit()) {
      return;
    }

    dispatch(
      SET_ALERT({
        alertMessage: '배송정보를 변경하시겠어요?',
        onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
        submitBtnText: '확인',
      })
    );
  };

  const checkBeforeEdit = (): boolean => {
    // const noMsg = !deliveryEditObj.deliveryMessage.length;
    const noMsg = false;

    switch (true) {
      case isMorning: {
        if (noMsg) {
          // const noMsg = !deliveryEditObj.deliveryMessage.length;
          dispatch(SET_ALERT({ alertMessage: '메시지를 입력해주세요.' }));
          return false;
        } else if (!deliveryEditObj.deliveryMessageType) {
          dispatch(SET_ALERT({ alertMessage: '츨입방법을 입력해주세요' }));
          return false;
        } else {
          return true;
        }
      }

      case isParcel: {
        if (noMsg) {
          // const noMsg = !deliveryEditObj.deliveryMessage.length;
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

  const changeInputHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (isSamePerson) {
        setIsSamePerson(false);
      }

      setDeliveryEditObj({ ...deliveryEditObj, [name]: value });
    },
    [deliveryEditObj]
  );

  const selectAccessMethodHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
      })
    );
  };

  const changeDeliveryPlace = () => {
    if (isSpot) {
      router.push({ pathname: '/spot/search/main', query: { orderId } });
    } else {
      router.push({ pathname: '/destination/search', query: { orderId } });
      dispatch(SET_USER_DELIVERY_TYPE(orderDetail?.delivery.toLowerCase()!));
    }
  };

  const onBlur = () => {
    dispatch(
      SET_TEMP_ORDER_INFO({
        isSamePerson: false,
        receiverName: deliveryEditObj.receiverName,
        receiverTel: deliveryEditObj.receiverTel,
      })
    );
  };

  useEffect(() => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      selectedMethod: userAccessMethod,
      deliveryMessageType: userAccessMethod?.value!,
    });
  }, [userAccessMethod]);

  useEffect(() => {
    setDeliveryEditObj({
      ...deliveryEditObj,
      location: tempEditDestination?.location,
    });
  }, [tempEditDestination]);

  useEffect(() => {
    if (isSamePerson && orderDetail) {
      setDeliveryEditObj({
        ...deliveryEditObj,
        receiverName: orderDetail?.receiverName,
        receiverTel: orderDetail?.receiverTel,
      });
      dispatch(INIT_TEMP_ORDER_INFO());
    }
    if (!isSamePerson) {
      dispatch(SET_TEMP_ORDER_INFO({ ...tempOrderInfo, isSamePerson: false }));
    }
  }, [isSamePerson]);

  useEffect(() => {
    dispatch(INIT_ACCESS_METHOD());
  }, []);

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
              value={deliveryEditObj.receiverName}
              eventHandler={changeInputHandler}
              onBlur={onBlur}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput
              placeholder="휴대폰 번호"
              name="receiverTel"
              value={deliveryEditObj.receiverTel}
              eventHandler={changeInputHandler}
              onBlur={onBlur}
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
                {`${DELIVERY_TYPE_MAP[orderDetail?.delivery!]} - ${DELIVERY_TIME_MAP[orderDetail?.deliveryDetail!]}`}
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
                  {`${tempEditSpot ? tempEditSpot.name : orderDetail?.spotName} ${
                    tempEditSpot ? tempEditSpot.spotPickup : orderDetail?.spotPickupName!
                  }`}
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
                <TextB2R>{deliveryEditObj?.location?.address}</TextB2R>
                <TextB2R>{deliveryEditObj?.location?.addressDetail}</TextB2R>
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
                <TextB2R color={theme.greyScale45}>{deliveryEditObj?.selectedMethod?.text || '출입방법 선택'}</TextB2R>
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
