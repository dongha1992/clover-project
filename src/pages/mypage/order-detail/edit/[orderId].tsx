import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexBetween,
  FlexCol,
  FlexRow,
  homePadding,
  fixedBottom,
} from '@styles/theme';
import {
  TextH4B,
  TextH5B,
  TextB2R,
  TextB3R,
  TextH6B,
} from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { setAlert } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { ACCESS_METHOD } from '@constants/payment/index';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import {
  getDestinations,
  editDestination,
  deleteDestinations,
} from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { Obj } from '@model/index';
import router from 'next/router';
import { getValues } from '@utils/getValues';
import { ACCESS_METHOD_MAP } from '@constants/payment';
import { IAccessMethod } from '@pages/payment';
import { commonSelector } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { PickupPlaceBox, DeliveryPlaceBox } from '@pages/cart/delivery-info';

const mapper: Obj = {
  MORNING: '새벽배송',
  SPOT: '스팟배송',
  PARCEL: '택배배송',
  QUICK: '퀵배송',
};

interface IProps {
  id: number;
}

const OrderDetailAddressEditPage = ({ id }: IProps) => {
  const [selectedAddress, setSelectedAddress] =
    useState<IDestinationsResponse>();
  const [selectedAccessMethod, setSelectedAccessMethod] =
    useState<IAccessMethod>();
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

  // const isParcel = selectedAddress?.delivery === 'PARCEL';
  // const isSpot = selectedAddress?.delivery === 'SPOT';
  // const isMorning = selectedAddress?.delivery === 'MORNING';

  const isParcel = false;
  const isSpot = false;
  const isMorning = true;

  const getAddressItem = async () => {
    const params = {
      page: 1,
      size: 10,
    };
    try {
      const { data } = await getDestinations(params);
      if (data.code === 200) {
        const { destinations } = data.data;
        const foundItem = destinations.find(
          (item: IDestinationsResponse) => item.id === id
        );
        setSelectedAddress(foundItem);

        const isMorning = foundItem?.delivery === 'MORNING';

        if (isMorning) {
          const userSelectMethod = getValues(foundItem, 'deliveryMessageType');
          const selectedMethod = ACCESS_METHOD.find(
            (item) => item.value === userSelectMethod
          );
          setSelectedAccessMethod(selectedMethod);
        }

        setDeliveryEditObj({
          deliveryName: foundItem?.name!,
          receiverTel: foundItem?.receiverTel!,
          receiverName: foundItem?.receiverName!,
          deliveryMessage: foundItem?.deliveryMessage!,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkSamePerson = () => {};

  const editDeliveryInfoHandler = () => {
    if (!cheekBeforeEdit()) {
      return;
    }

    dispatch(
      setAlert({
        alertMessage: '내용을 수정했습니다.',
        onSubmit: () => editAddress(),
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
          dispatch(setAlert({ alertMessage: '메시지를 입력해주세요.' }));
          return false;
        } else if (noAccessMethod) {
          dispatch(setAlert({ alertMessage: '츨입방법을 입력해주세요' }));
          return false;
        } else {
          return true;
        }
      }

      case isParcel: {
        if (noMsg) {
          dispatch(setAlert({ alertMessage: '메시지를 입력해주세요.' }));
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

  const editAddress = async () => {
    const reqBody = {
      id,
      address: selectedAddress?.location.address,
      addressDetail: selectedAddress?.location.addressDetail,
      delivery: selectedAddress?.delivery,
      deliveryMessage: deliveryEditObj.deliveryMessage,
      deliveryMessageTypeType: selectedAccessMethod?.value!,
      dong: selectedAddress?.location.dong,
      main: isDefaultSpot,
      name: deliveryEditObj.deliveryName,
      receiverName: deliveryEditObj.receiverName,
      receiverTel: deliveryEditObj.receiverTel,
      zipCode: selectedAddress?.location.zipCode,
    };

    const { data } = await editDestination(id, reqBody);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setDeliveryEditObj({ ...deliveryEditObj, [name]: value });
  };

  const selectAccessMethodHandler = () => {
    dispatch(
      setBottomSheet({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
      })
    );
  };

  useEffect(() => {
    getAddressItem();
  }, []);

  useEffect(() => {
    setSelectedAccessMethod(userAccessMethod);
  }, [userAccessMethod]);

  const placeInfoRender = () => {
    const deliveryType = 'parcel';

    switch (deliveryType) {
      case 'spot': {
        return <PickupPlaceBox place={{ name: 'test', address: 'test' }} />;
      }

      default: {
        return <DeliveryPlaceBox place={{ name: 'test', address: 'test' }} />;
      }
    }
  };

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
          <FlexCol>{placeInfoRender()}</FlexCol>
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isMorning && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>
                  {selectedAccessMethod?.text || '출입방법 선택'}
                </TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                placeholder={
                  ACCESS_METHOD_MAP[selectedAccessMethod?.value!]
                    ? ACCESS_METHOD_MAP[selectedAccessMethod?.value!]
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
                  공동현관 및 무인택배함 비밀번호는 조합 방식 및
                  순서(#,호출버튼)와 함께 자세히 기재해주세요.
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
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={editDeliveryInfoHandler}
        >
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
