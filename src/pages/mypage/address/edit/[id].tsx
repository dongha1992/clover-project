import React, { useState, useEffect, useRef } from 'react';
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
import { useDispatch } from 'react-redux';
import { ACCESS_METHOD } from '@pages/payment/index';
import { Select, AcessMethodOption } from '@components/Shared/Dropdown';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import {
  getDestinations,
  editDestination,
  deleteDestinations,
} from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { Obj } from '@model/index';

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
  const [selectedAddress, setSelectedAddress] =
    useState<IDestinationsResponse>();
  const [selectedAccessMethod, setSelectedAccessMethod] = useState<string>('');
  const [isSamePerson, setIsSamePerson] = useState(false);
  const [isDefaultSpot, setIsDefaultSpot] = useState(false);
  const [deliveryEditObj, setDeliveryEditObj] = useState({
    deliveryName: '',
    receiverTel: '',
    receiverName: '',
    deliveryMessage: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    getAddressItem();
  }, []);

  const getAddressItem = async () => {
    const params = {
      page: 1,
      size: 10,
    };
    try {
      const { data } = await getDestinations(params);
      if (data.code === 200) {
        const { destinations } = data.data;
        setSelectedAddress(
          destinations.find((item: IDestinationsResponse) => item.id === id)
        );
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
      setAlert({
        alertMessage: '프코스팟을 삭제하시겠어요?',
        onSubmit: () => removeAddress(),
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };
  const editAddressHandler = () => {
    dispatch(
      setAlert({
        alertMessage: '내용을 수정했습니다.',
        onSubmit: () => editAddress(),
        submitBtnText: '확인',
      })
    );
  };

  console.log(selectedAddress, 'selec');

  // receiverName 스웨거 수정안됨
  const editAddress = async () => {
    const reqBody = {
      // id,
      // address: selectedAddress?.location.address,
      // addressDetail: selectedAddress?.location.addressDetail,
      // delivery: selectedAddress?.delivery,
      // deliveryMessage: deliveryEditObj.deliveryMessage,
      // dong: selectedAddress?.location.dong,
      // main: isDefaultSpot,
      // name: deliveryEditObj.deliveryName,
      // receiverName: deliveryEditObj.receiverName,
      // receiverTel: deliveryEditObj.receiverTel,
      // zipCode: selectedAddress?.location.zipCode,
      id: 13,
      address: '충청남도 서산시 갈산4길 32',
      addressDetail: '테스트',
      delivery: 'PARCEL',
      deliveryMessage: '수정테스트',
      dong: '갈산동',
      main: false,
      name: '테스트로컬',
      receiverName: '테스트로컬',
      receiverTel: '01012345678',
      zipCode: '31963',
    };
    const { data } = await editDestination(id, reqBody);
    console.log(data, 'data');
  };

  const removeAddress = async () => {
    const { data } = await deleteDestinations(id);
    /* TODO: 수정 후 액션 */
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setDeliveryEditObj({ ...deliveryEditObj, [name]: value });
  };

  const selectOptionHandler = (text: string) => {
    setSelectedAccessMethod(text);
  };

  const changePickUpPlace = () => {
    dispatch(setBottomSheet({ content: <PickupSheet />, buttonTitle: '확인' }));
  };

  const isParcel = selectedAddress?.delivery === 'PARCEL';
  const isSpot = selectedAddress?.delivery === 'SPOT';

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
              value={selectedAddress?.receiverName}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput
              placeholder="휴대폰 번호"
              name="receiverTel"
              value={selectedAddress?.receiverTel}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <TextH4B>배송정보</TextH4B>
            {isSpot && (
              <TextH6B
                color={theme.greyScale65}
                textDecoration="underline"
                onClick={changePickUpPlace}
              >
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
                <TextB2R>헤이그라운드 서울숲점 - 10층 냉장고</TextB2R>
                <TextB3R color={theme.greyScale65}>
                  서울 성동구 왕십리로 115 10층
                </TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </FlexCol>
        </DevlieryInfoWrapper>
        <BorderLine height={8} margin="24px 0 0 0" />
        {isParcel && (
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <Select placeholder="배송출입 방법" value={selectedAccessMethod}>
                {ACCESS_METHOD.map((option: any, index: number) => (
                  <AcessMethodOption
                    key={index}
                    option={option}
                    selectOptionHandler={selectOptionHandler}
                  />
                ))}
              </Select>
              <TextInput
                name="deliveryMessage"
                placeholder="내용을 입력해주세요"
                margin="8px 0 0 0"
                value={deliveryEditObj.deliveryMessage}
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
        <BorderLine height={8} margin="0 0 24px 0" />
        {isParcel && (
          <FlexCol padding="0 24px 24px 24px">
            <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
            <TextInput
              name="deliveryName"
              value={selectedAddress?.name}
              eventHandler={changeInputHandler}
            />
          </FlexCol>
        )}
        <FlexRow padding="0 24px">
          <Checkbox onChange={checkDefaultSpot} isSelected={isDefaultSpot} />
          <TextH5B padding="2px 0 0 8px">
            {isSpot ? '기본 프코 스팟으로 설정' : '기본 배송지로 설정'}
          </TextH5B>
        </FlexRow>
      </Wrapper>
      <BtnWrapper>
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={removeAddressHandler}
        >
          삭제하기
        </Button>
        <Col />
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={editAddressHandler}
        >
          수정하기
        </Button>
      </BtnWrapper>
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

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  return {
    props: { id: Number(id) },
  };
}
export default AddressEditPage;
