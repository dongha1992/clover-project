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
import { SPOT_URL } from '@constants/mock';
import axios from 'axios';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';
import { ACCESS_METHOD } from '@pages/payment/index';
import { Select, AcessMethodOption } from '@components/Shared/Dropdown';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';

const isParcel = true;

const AddressEditPage = ({ id }: any) => {
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isSamePerson, setIsSamePerson] = useState(false);
  const [isDefaultSpot, setIsDefaultSpot] = useState(false);

  const deliveryPlaceRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getAddressItem();
  }, []);

  const getAddressItem = async () => {
    const { data } = await axios.get(SPOT_URL);
    setSelectedAddress(data.find((item: any) => item.id === Number(id)));
  };

  const checkSamePerson = () => {};

  const checkDefaultSpot = () => {
    setIsDefaultSpot(!isDefaultSpot);
  };

  const removeAddress = () => {
    dispatch(
      setAlert({
        alertMessage: '프코스팟을 삭제하시겠어요?',
        onSubmit: () => {},
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );
  };
  const editAddress = () => {
    dispatch(
      setAlert({
        alertMessage: '내용을 수정했습니다.',
        onSubmit: () => {},
        submitBtnText: '확인',
      })
    );
  };

  const selectOptionHandler = () => {};

  const changePickUpPlace = () => {
    dispatch(setBottomSheet({ content: <PickupSheet />, buttonTitle: '확인' }));
  };

  if (Object.keys(selectedAddress).length < 0) {
    return <div>로딩중</div>;
  }

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
            <TextInput placeholder="이름" />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
            <TextInput placeholder="휴대폰 번호" />
          </FlexCol>
        </ReceiverInfoWrapper>
        <BorderLine height={8} margin="24px 0" />
        <DevlieryInfoWrapper>
          <FlexBetween padding="0 0 24px 0">
            <TextH4B>배송정보</TextH4B>
            <TextH6B
              color={theme.greyScale65}
              textDecoration="underline"
              onClick={changePickUpPlace}
            >
              픽업 장소 변경
            </TextH6B>
          </FlexBetween>
          <FlexCol>
            <FlexBetween padding="0 0 16px 0">
              <TextH5B>배송방법</TextH5B>
              <TextB2R>스팟배송</TextB2R>
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
              <Select placeholder="배송출입 방법">
                {ACCESS_METHOD.map((option: any, index: number) => (
                  <AcessMethodOption
                    key={index}
                    option={option}
                    selectOptionHandler={selectOptionHandler}
                  />
                ))}
              </Select>
              <TextInput placeholder="내용을 입력해주세요" margin="8px 0 0 0" />
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
            <TextInput ref={deliveryPlaceRef} />
          </FlexCol>
        )}
        <FlexRow padding="0 24px">
          <Checkbox onChange={checkDefaultSpot} isSelected={isDefaultSpot} />
          <TextH5B padding="2px 0 0 8px">기본 프코 스팟으로 설정</TextH5B>
        </FlexRow>
      </Wrapper>
      <BtnWrapper>
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={removeAddress}
        >
          삭제하기
        </Button>
        <Col />
        <Button
          height="100%"
          width="100%"
          borderRadius="0"
          onClick={editAddress}
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
    props: { id },
  };
}
export default AddressEditPage;
