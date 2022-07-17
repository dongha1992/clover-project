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
import router, { useRouter } from 'next/router';
import { ACCESS_METHOD_PLACEHOLDER, ACCESS_METHOD, DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/order';
import { commonSelector, INIT_ACCESS_METHOD } from '@store/common';
import { mypageSelector, INIT_TEMP_ORDER_INFO, SET_TEMP_ORDER_INFO, INIT_TEMP_EDIT_DESTINATION } from '@store/mypage';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { destinationForm, SET_USER_DELIVERY_TYPE } from '@store/destination';
import { pipe, indexBy } from '@fxts/core';
import { Obj } from '@model/index';
import debounce from 'lodash-es/debounce';
import { useGetOrderDetail } from 'src/queries/order';
import { SubsDeliveryChangeSheet } from '@components/BottomSheet/SubsSheet';

/* TODO: 서버/store 값 state에서 통일되게 관리, spot 주소쪽 */
interface IProps {
  orderId: number;
  destinationId: number;
  isSubscription: string;
}

const OrderDetailAddressEditPage = ({ orderId, destinationId, isSubscription }: IProps) => {
  const router = useRouter();

  const { userAccessMethod } = useSelector(commonSelector);
  const { tempEditDestination, tempEditSpot, tempOrderInfo } = useSelector(mypageSelector);
  const { applyAll } = useSelector(destinationForm);

  const [isSamePerson, setIsSamePerson] = useState(tempOrderInfo?.isSamePerson);
  const [deliveryEditObj, setDeliveryEditObj] = useState<any>({
    selectedMethod: {},
    location: {},
    deliveryMessageType: '',
    deliveryMessage: '',
    receiverTel: '',
    receiverName: '',
  });
  const [deliveryRound, setDeliveryRound] = useState();
  const [isSub, setIsSub] = useState(false);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { data } = useGetOrderDetail(['getOrderDetail', orderId], orderId, {
    onSuccess: (data) => {
      // TODO(young) : 구독에서 destinationId있으면 orderDeliveries에서 같은 destinationId로
      // 일반 주문도 orderId가 아닌 destinationId가 필요한지 확인 필요
      let orderDetail;

      data.orderDeliveries.forEach((o: any) => {
        if (o.type === 'SUB') {
          setIsSub(true);
        }
        if (o.id === destinationId) {
          setDeliveryRound(o.deliveryRound);
        }
        if (o.id === destinationId) {
          orderDetail = o;
        }
      });

      if (!destinationId) {
        orderDetail = data?.orderDeliveries[0];
      }

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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

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
          data: { ...rest, applyAll },
          deliveryId: destinationId ?? deliveryId,
        });
      } else {
        const { data } = await editSpotDestinationApi({
          data: {
            applyAll,
            receiverName: deliveryEditObj.receiverName,
            receiverTel: deliveryEditObj.receiverTel,
            spotPickupId: tempEditSpot?.spotPickupId ? +tempEditSpot?.spotPickupId : orderDetail?.spotPickupId!,
          },
          deliveryId: destinationId ?? deliveryId,
        });
      }
    },
    {
      onSuccess: async () => {
        // TODO : 일반 주문도 배송지 변경후 이동 action이 있어야 할듯
        if (isSubscription && destinationId) {
          router.push({ pathname: `/subscription/${orderId}` });
        }
        await queryClient.refetchQueries(['getOrderDetail', orderId]);
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
    if (data.type === 'SUBSCRIPTION') {
      if (applyAll) {
        // 정기구독 배송지 남은 전체 회차 변경

        if (isSub) {
          // 합배송이 있는경우
          dispatch(
            SET_ALERT({
              alertMessage: '함께배송 주문 배송지도 변경돼요!\n남은 회차 모두 변경하시겠어요?',
              onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
              submitBtnText: '확인',
              closeBtnText: '취소',
            })
          );
        } else {
          // 합배송이 없는경우
          dispatch(
            SET_ALERT({
              alertMessage: '남은 회차 모두 변경하시겠어요?',
              onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
              submitBtnText: '확인',
              closeBtnText: '취소',
            })
          );
        }
      } else {
        // 정기구독 배송지 선택 회차만 변경

        if (isSub) {
          // 합배송이 있는경우
          dispatch(
            SET_ALERT({
              alertMessage: `함께배송 주문 배송지도 변경돼요!\n${deliveryRound}회차의 배송지를 변경하시겠어요?`,
              onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
              submitBtnText: '확인',
              closeBtnText: '취소',
            })
          );
        } else {
          // 합배송이 없는경우
          dispatch(
            SET_ALERT({
              alertMessage: `${deliveryRound}회차의 배송지를\n변경하시겠어요?`,
              onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
              submitBtnText: '확인',
              closeBtnText: '취소',
            })
          );
        }
      }
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: '배송정보를 변경하시겠어요?',
          onSubmit: () => mutationDeliveryInfo(deliveryEditObj),
          submitBtnText: '확인',
        })
      );
    }
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
    const isCancel = !!data?.unsubscriptionType;
    if (data.type === 'SUBSCRIPTION') {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <SubsDeliveryChangeSheet goToDeliverySearch={goToDeliverySearch} isCancel={isCancel} />,
        })
      );
    } else {
      goToDeliverySearch();
    }
  };

  const goToDeliverySearch = () => {
    if (isSpot) {
      const IsSubs = isSubscription === 'true';
      router.push({ pathname: '/spot/search/main', query: { orderId, destinationId, isSubscription: IsSubs } });
    } else {
      router.push({ pathname: '/destination/search', query: { orderId, destinationId } });
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
            <>
              <FlexBetweenStart padding="16px 0 0 0">
                <TextH5B>배송지</TextH5B>
                <FlexColEnd>
                  <TextB2R>{deliveryEditObj?.location?.address}</TextB2R>
                  <TextB2R>{deliveryEditObj?.location?.addressDetail}</TextB2R>
                </FlexColEnd>
              </FlexBetweenStart>
              <BorderLine height={8} margin="24px 0 0 0" />
            </>
          )}
        </DevlieryInfoWrapper>
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
  const { orderId, destinationId, isSubscription } = context.query;

  return {
    props: { orderId: Number(orderId), destinationId: Number(destinationId), isSubscription: String(isSubscription) },
  };
}
export default OrderDetailAddressEditPage;
