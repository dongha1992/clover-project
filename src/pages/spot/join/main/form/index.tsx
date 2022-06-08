import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { theme, FlexRow, fixedBottom } from '@styles/theme';
import { TextH2B, TextH4B, TextB3R, TextH5B, TextB2R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { useRouter } from 'next/router';
import Checkbox from '@components/Shared/Checkbox';
import { Button } from '@components/Shared/Button';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { OptionsSheet } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector, SET_SPOT_REGISTRATIONS_INFO, SET_SPOT_JOIN_FORM_CHECKED } from '@store/spot';

const RegisterPage = () => {
  const { 
    spotLocation, 
    spotsRegistrationOptions, 
    spotsRegistrationInfo,
    spotJoinFormChecked,
  } = useSelector(spotSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const placeRef = useRef<HTMLInputElement>(null);
  const pickUpRef = useRef<HTMLInputElement>(null);
  const placeEtcRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const managerRef = useRef<HTMLInputElement>(null);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(spotJoinFormChecked);

  const checkedPickup = !!pickUpRef.current?.value?.length;
  const checkedLunchType = !!spotsRegistrationOptions.lunchTimeOptions?.value?.length;
  const checkedPlaceType = !!spotsRegistrationOptions.placeTypeOptions?.value?.length;
  const checkedAddressInfo = !!spotLocation.address?.length && !!placeRef.current?.value?.length;
  const checkedUserInfo =
    !!spotsRegistrationInfo?.userName?.length &&
    !!spotsRegistrationInfo.userEmail?.length &&
    !!spotsRegistrationInfo.userTel?.length;
  const checkedPlaceTypeEtc = () => {
    if(spotsRegistrationOptions.placeTypeOptions?.value === 'ETC'){
      return placeEtcRef.current?.value?.length! > 0;
    } else {
      return true;
    }
  };

  const activeButton = () => {
    switch (type) {
      case 'PRIVATE':
        return (
          (checkedAddressInfo &&
          checkedPickup &&
          checkedLunchType &&
          checkedPlaceType &&
          checkedPlaceTypeEtc() &&
          checkedUserInfo &&
          noticeChecked) || spotJoinFormChecked
        );
      case 'PUBLIC':
        return (
          (checkedAddressInfo && 
          checkedPlaceType && 
          checkedPlaceTypeEtc()) || spotJoinFormChecked
        );
      case 'OWNER':
        return (
          (checkedAddressInfo && 
          checkedPlaceType && 
          checkedPlaceTypeEtc() && 
          checkedUserInfo && 
          noticeChecked) || spotJoinFormChecked
        );
      default:
        return false;
    }
  };

  const goToSubmit = async () => {
    if (!activeButton()) {
      if (type === 'PRIVATE') {
        return;
      }
      return;
    }
    dispatch(SET_SPOT_JOIN_FORM_CHECKED(true));
    router.push({
      pathname: '/spot/join/main/form/submit',
      query: { type, checked: true },
    });
  };

  const selectOptions = (tab: string) => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <OptionsSheet tab={tab} />,
      })
    );
  };

  const goToLocation = () => {
    router.push({
      pathname: '/spot/location',
      query: { type },
    });
  };

  // 장소명
  const placeInputHandler = () => {
    if (placeRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        placeName: placeRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // 픽업장소
  const pickUpInputHandler = () => {
    if (pickUpRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        pickupLocation: pickUpRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // 장소 종류 기타 선택시 입력값
  const placeEtcInputHandler = () => {
    if (placeEtcRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        placeTypeEtc: placeEtcRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // type owner - 직급 호칭 입력값
  const managerInfoInputHandler = () => {
    if (managerRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        managerInfo: managerRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  // 유저 이름
  const userNameInputHandler = () => {
    if (nameRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        userName: nameRef.current.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  //유저 이메일
  const userEmailInputHandler = () => {
    if (emailRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        userEmail: emailRef.current.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  // 휴대전화
  const userTelInputHandler = () => {
    if (telRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        userTel: telRef.current.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  const noticeHandler = () => {
    setNoticeChecked(!noticeChecked);
  };

  return (
    <Container>
      <TextH2B padding='24px 24px 48px 24px'>
        {'신청서 내용을\n입력해 주세요.'}
      </TextH2B>
      <FormWrapper>
        <Wrapper>
          <TextH5B margin="0 0 16px 0">주소</TextH5B>
          <LocationWrapper onClick={goToLocation}>
            {!spotLocation.address?.length ? (
              <TextH4B center color={theme.black}>
                주소 검색하기
              </TextH4B>
            ) : (
              <>
                <TextH4B>{`${spotLocation.address} ${spotLocation.bdNm}`}</TextH4B>
                <TextB2R>{spotLocation.addressDetail}</TextB2R>
              </>
            )}
          </LocationWrapper>
        </Wrapper>
        <Wrapper>
          <TextH5B margin="0 0 16px 0">{`${type === 'PRIVATE' ? '장소명' : '상호명'}`}</TextH5B>
          <TextInput
            ref={placeRef}
            eventHandler={placeInputHandler}
            value={spotsRegistrationInfo.placeName?.length ? spotsRegistrationInfo.placeName : null}
            placeholder={type === 'PRIVATE' ? '장소명 입력' : '상호명 입력'}
          />
        </Wrapper>
        {type === 'PRIVATE' && (
          <Wrapper>
            <TextH5B margin="0 0 16px 0">픽업 장소</TextH5B>
            <TextInput
              margin="8px 0 0 0"
              placeholder="ex. 8층 공용 냉장고, 2층 안내 데스크"
              ref={pickUpRef}
              eventHandler={pickUpInputHandler}
              value={spotsRegistrationInfo.pickupLocation?.length ? spotsRegistrationInfo.pickupLocation : null}
            />
          </Wrapper>
        )}
        <Wrapper>
          <TextH5B margin="0 0 16px 0">장소 종류</TextH5B>
          <Button
            justifyContent="space-between"
            padding="12px 16px"
            backgroundColor={theme.white}
            color={theme.greyScale45}
            fontWeight={400}
            borderGrey15
            pointer
            onClick={() => selectOptions('place')}
          >
            {spotsRegistrationOptions.placeTypeOptions?.name?.length ? (
              <TextB2R color={theme.black}>{spotsRegistrationOptions.placeTypeOptions?.name} </TextB2R>
            ) : (
              '공간 형태 선택'
            )}
            <SVGIcon name="triangleDown" />
          </Button>
          {spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' && (
            <TextInput
              margin="8px 0 0 0"
              placeholder="기타 장소 종류 입력"
              ref={placeEtcRef}
              eventHandler={placeEtcInputHandler}
              value={spotsRegistrationInfo.placeTypeEtc?.length ? spotsRegistrationInfo.placeTypeEtc : null}
            />
          )}
        </Wrapper>
        {type === 'PRIVATE' && (
          <Wrapper>
            <TextH5B margin="0 0 16px 0">점심시간</TextH5B>
            <Button
              justifyContent="space-between"
              backgroundColor={theme.white}
              padding="12px 16px"
              color={theme.greyScale45}
              fontWeight={400}
              borderGrey15
              pointer
              onClick={() => selectOptions('time')}
            >
              {spotsRegistrationOptions.lunchTimeOptions?.name?.length ? (
                <TextB2R color={theme.black}>{spotsRegistrationOptions.lunchTimeOptions?.name} </TextB2R>
              ) : (
                '시간대 선택'
              )}
              <SVGIcon name="triangleDown" />
            </Button>
          </Wrapper>
        )}
        {(type === 'PRIVATE' || type === 'OWNER') && (
          <>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">이름</TextH5B>
              <TextInput
                ref={nameRef}
                eventHandler={userNameInputHandler}
                value={spotsRegistrationInfo.userName?.length ? spotsRegistrationInfo.userName : null}
                placeholder="이름 입력"
              />
            </Wrapper>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">이메일</TextH5B>
              <TextInput
                ref={emailRef}
                eventHandler={userEmailInputHandler}
                value={spotsRegistrationInfo.userEmail?.length ? spotsRegistrationInfo.userEmail : null}
                placeholder="이메일 입력"
              />
            </Wrapper>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">휴대폰 번호</TextH5B>
              <TextInput
                ref={telRef}
                eventHandler={userTelInputHandler}
                value={spotsRegistrationInfo.userTel?.length ? spotsRegistrationInfo.userTel : null}
                placeholder="휴대폰 번호 (-제외)"
              />
            </Wrapper>
          </>
        )}
        {type === 'OWNER' && (
          <>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">직급/호칭</TextH5B>
              <TextInput
                ref={managerRef}
                eventHandler={managerInfoInputHandler}
                value={spotsRegistrationInfo.managerInfo?.length ? spotsRegistrationInfo.managerInfo : null}
                placeholder="직급 또는 호칭 입력"
              />
            </Wrapper>
            <FlexRow padding="0 0 64px 0">
              <Checkbox onChange={noticeHandler} isSelected={noticeChecked} />
              <TextB2R margin="0 0 0 8px" padding="3px 0 0 0" onClick={noticeHandler}>
                신청자가 장소관리자임을 확인했습니다.
              </TextB2R>
            </FlexRow>
          </>
        )}
      </FormWrapper>
      {type === 'PRIVATE' && (
        <BottomWrapper>
          <FlexRow>
            <Checkbox onChange={noticeHandler} isSelected={noticeChecked} />
            <TextH5B margin="0 0 0 8px" padding="3px 0 0 0" onClick={noticeHandler}>
              픽업 장소 선정 유의사항을 확인했습니다.
            </TextH5B>
          </FlexRow>
          <Row />
          <TextB3R color={theme.greyScale65}>
            픽업장소 배송 시에 외부인 출입 제한 및 복잡한 출입 절차가 있을 경우에 픽업장소가 변경 될 수 있습니다. (예시
            : 직원 전용 엘레베이터, 출입 제한 건물)
          </TextB3R>
        </BottomWrapper>
      )}
      <FixedButton onClick={goToSubmit}>
        <Button
          borderRadius="0"
          height="100%"
          padding="10px 0 0 0"
          backgroundColor={activeButton() ? theme.balck : theme.greyScale6}
        >
          다음
        </Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.main``;

const FormWrapper = styled.section`
  margin-bottom: 32px;
  padding: 0 24px;
`;
const Wrapper = styled.div`
  margin-bottom: 32px;
`;

const LocationWrapper = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${theme.black};
  cursor: pointer;
`;
const BottomWrapper = styled.section`
  padding: 32px 0 0 0;
  padding: 24px;
  border-top: 10px solid ${theme.greyScale6};
`;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

export default RegisterPage;
