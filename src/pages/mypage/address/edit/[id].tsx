import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexBetween,
  FlexCol,
  FlexRow,
  homePadding,
  FlexBetweenStart,
  FlexColEnd,
  fixedBottom,
} from '@styles/theme';
import { TextH4B, TextH5B, TextB2R, TextB3R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import BorderLine from '@components/Shared/BorderLine';
import { ButtonGroup } from '@components/Shared/Button';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { ACCESS_METHOD } from '@constants/payment/index';
import SVGIcon from '@utils/SVGIcon';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { getDestinations, editDestination, deleteDestinations } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { Obj } from '@model/index';
import router from 'next/router';
import { getValues } from '@utils/getValues';
import { ACCESS_METHOD_PLACEHOLDER } from '@constants/payment';
import { IAccessMethod } from '@pages/payment';
import { commonSelector } from '@store/common';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
/*TODO: 주문자와 동일 기능 */
/*TODO: reqBody Type  */

const mapper: Obj = {
  MORNING: '새벽배송',
  SPOT: '스팟배송',
  PARCEL: '택배배송',
  QUICK: '퀵배송',
};

interface IProps {
  id: number;
}

interface IAddress {
  address: string;
  addressDetail: string;
  zipCode: string;
  dong: string;
}

const AddressEditPage = ({ id }: IProps) => {
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

  const isParcel = selectedAddress?.delivery === 'PARCEL';
  const isSpot = selectedAddress?.delivery === 'SPOT';
  const isMorning = selectedAddress?.delivery === 'MORNING';

  const getAddressItem = async () => {
    const params = {
      page: 1,
      size: 10,
    };
    try {
      const { data } = await getDestinations(params);
      if (data.code === 200) {
        const { destinations } = data.data;
        const foundItem = destinations.find((item: IDestinationsResponse) => item.id === id);
        setSelectedAddress(foundItem);

        const isMorning = foundItem?.delivery === 'MORNING';

        if (isMorning) {
          const userSelectMethod = getValues(foundItem, 'deliveryMessageType');
          const selectedMethod = ACCESS_METHOD.find((item) => item.value === userSelectMethod);
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

  const checkDefaultSpot = () => {
    setIsDefaultSpot(!isDefaultSpot);
  };

  const removeAddressHandler = () => {
    dispatch(
      SET_ALERT({
        alertMessage: isSpot ? '프코스팟을 삭제하시겠어요?' : '배송지를 삭제하시겠어요?',
        onSubmit: () => removeAddress(),
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };

  const editAddressHandler = () => {
    if (!cheekBeforeEdit()) {
      return;
    }

    dispatch(
      SET_ALERT({
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

  const removeAddress = async () => {
    try {
      const { data } = await deleteDestinations(id);
      if (data.code === 200) {
        router.push('/mypage/address');
      }
    } catch (error) {
      console.error(error);
    }
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

  const changePickUpPlace = () => {
    dispatch(SET_BOTTOM_SHEET({ content: <PickupSheet /> }));
  };

  useEffect(() => {
    getAddressItem();
  }, []);

  useEffect(() => {
    setSelectedAccessMethod(userAccessMethod);
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
            <TextH4B>배송정보</TextH4B>
            {isSpot && (
              <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={changePickUpPlace}>
                픽업 장소 변경
              </TextH6B>
            )}
          </FlexBetween>
          <FlexCol>
            <FlexBetween padding="0 0 16px 0">
              <TextH5B>배송방법</TextH5B>
              <TextB2R>{mapper[selectedAddress?.delivery!]}</TextB2R>
            </FlexBetween>
            <FlexBetweenStart>
              <TextH5B>베송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{selectedAddress?.location.addressDetail}</TextB2R>
                <TextB3R color={theme.greyScale65}>{selectedAddress?.location.address}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </FlexCol>
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
        <BorderLine height={8} margin="0 0 24px 0" />
        {!isSpot && (
          <FlexCol padding="0 24px 24px 24px">
            <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
            <TextInput name="deliveryName" value={deliveryEditObj?.deliveryName} eventHandler={changeInputHandler} />
          </FlexCol>
        )}
        <FlexRow padding="0 24px">
          <Checkbox onChange={checkDefaultSpot} isSelected={isDefaultSpot} />
          <TextH5B padding="2px 0 0 8px">{isSpot ? '기본 프코 스팟으로 설정' : '기본 배송지로 설정'}</TextH5B>
        </FlexRow>
      </Wrapper>
      <ButtonGroup
        rightButtonHandler={editAddressHandler}
        leftButtonHandler={removeAddressHandler}
        leftText="삭제하기"
        rightText="수정하기"
      />
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  margin-bottom: 70px;
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

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  return {
    props: { id: Number(id) },
  };
}
export default AddressEditPage;
