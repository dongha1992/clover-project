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
import { PHONE_REGX } from '@pages/signup/auth';

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

  const checkedPickup = pickUpRef.current?.value?.length! > 0;
  const checkedLunchType = spotsRegistrationOptions.lunchTimeOptions?.value?.length > 0;
  const checkedPlaceType = spotsRegistrationOptions.placeTypeOptions?.value?.length > 0;
  const checkedAddressInfo = spotLocation.address?.length! > 0 && placeRef.current?.value?.length! > 0;
  const checkedUserInfo =
    spotsRegistrationInfo?.userName?.length > 0 &&
    spotsRegistrationInfo.userEmail?.length > 0 &&
    spotsRegistrationInfo.userTel?.length > 0;
  const checkedManagerLevelInfo = spotsRegistrationInfo.managerInfo?.length > 0;
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
          noticeChecked &&
          checkedManagerLevelInfo) || spotJoinFormChecked
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
    router.replace({
      pathname: '/spot/location',
      query: { type },
    });
  };

  // ?????????
  const placeInputHandler = () => {
    if (placeRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        placeName: placeRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // ????????????
  const pickUpInputHandler = () => {
    if (pickUpRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        pickupLocation: pickUpRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // ?????? ?????? ?????? ????????? ?????????
  const placeEtcInputHandler = () => {
    if (placeEtcRef.current) {
      const selectedOptions = {
        ...spotsRegistrationInfo,
        placeTypeEtc: placeEtcRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    }
  };

  // type owner - ?????? ?????? ?????????
  const managerInfoInputHandler = () => {
    if (managerRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        managerInfo: managerRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  // ?????? ??????
  const userNameInputHandler = () => {
    if (nameRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        userName: nameRef.current.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  //?????? ?????????
  const userEmailInputHandler = () => {
    if (emailRef.current) {
      const inputUserInfo = {
        ...spotsRegistrationInfo,
        userEmail: emailRef.current.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(inputUserInfo));
    }
  };

  // ????????????
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
        {'????????? ?????????\n????????? ?????????.'}
      </TextH2B>
      <FormWrapper>
        <Wrapper>
          <TextH5B margin="0 0 16px 0">??????</TextH5B>
          <LocationWrapper onClick={goToLocation}>
            {!spotLocation.address?.length ? (
              <TextH5B center color={theme.black}>
                ?????? ????????????
              </TextH5B>
            ) : (
              <>
                <TextH4B>{`${spotLocation.address} ${spotLocation.bdNm}`}</TextH4B>
                <TextB2R>{spotLocation.addressDetail}</TextB2R>
              </>
            )}
          </LocationWrapper>
        </Wrapper>
        <Wrapper>
          <TextH5B margin="0 0 16px 0">{`${type === 'PRIVATE' ? '?????????' : '?????????'}`}</TextH5B>
          <TextInput
            ref={placeRef}
            eventHandler={placeInputHandler}
            value={spotsRegistrationInfo.placeName?.length ? spotsRegistrationInfo.placeName : null}
            placeholder={type === 'PRIVATE' ? '????????? ??????' : '????????? ??????'}
          />
        </Wrapper>
        {type === 'PRIVATE' && (
          <Wrapper>
            <TextH5B margin="0 0 16px 0">?????? ??????</TextH5B>
            <TextInput
              margin="8px 0 0 0"
              placeholder="ex. 8??? ?????? ?????????, 2??? ?????? ?????????"
              ref={pickUpRef}
              eventHandler={pickUpInputHandler}
              value={spotsRegistrationInfo.pickupLocation?.length ? spotsRegistrationInfo.pickupLocation : null}
            />
          </Wrapper>
        )}
        <Wrapper>
          <TextH5B margin="0 0 16px 0">?????? ??????</TextH5B>
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
              '?????? ?????? ??????'
            )}
            <SVGIcon name="triangleDown" />
          </Button>
          {spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' && (
            <TextInput
              margin="8px 0 0 0"
              placeholder="?????? ?????? ?????? ??????"
              ref={placeEtcRef}
              eventHandler={placeEtcInputHandler}
              value={spotsRegistrationInfo.placeTypeEtc?.length ? spotsRegistrationInfo.placeTypeEtc : null}
            />
          )}
        </Wrapper>
        {type === 'PRIVATE' && (
          <Wrapper>
            <TextH5B margin="0 0 16px 0">????????????</TextH5B>
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
                '????????? ??????'
              )}
              <SVGIcon name="triangleDown" />
            </Button>
          </Wrapper>
        )}
        {(type === 'PRIVATE' || type === 'OWNER') && (
          <>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">??????</TextH5B>
              <TextInput
                ref={nameRef}
                eventHandler={userNameInputHandler}
                value={spotsRegistrationInfo.userName?.length ? spotsRegistrationInfo.userName : null}
                placeholder="?????? ??????"
              />
            </Wrapper>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">?????????</TextH5B>
              <TextInput
                ref={emailRef}
                eventHandler={userEmailInputHandler}
                value={spotsRegistrationInfo.userEmail?.length ? spotsRegistrationInfo.userEmail : null}
                placeholder="????????? ??????"
              />
            </Wrapper>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">????????? ??????</TextH5B>
              <TextInput
                ref={telRef}
                inputType='number'
                eventHandler={userTelInputHandler}
                value={spotsRegistrationInfo.userTel?.length ? spotsRegistrationInfo.userTel : null}
                placeholder="????????? ?????? ?????? (-??????)"
              />
            </Wrapper>
          </>
        )}
        {type === 'OWNER' && (
          <>
            <Wrapper>
              <TextH5B margin="0 0 16px 0">??????/??????</TextH5B>
              <TextInput
                ref={managerRef}
                eventHandler={managerInfoInputHandler}
                value={spotsRegistrationInfo.managerInfo?.length ? spotsRegistrationInfo.managerInfo : null}
                placeholder="?????? ?????? ?????? ??????"
              />
            </Wrapper>
            <FlexRow padding="0 0 64px 0">
              <Checkbox onChange={noticeHandler} isSelected={noticeChecked} />
              <TextB2R margin="0 0 0 8px" padding="3px 0 0 0" onClick={noticeHandler}>
                ???????????? ????????????????????? ??????????????????.
              </TextB2R>
            </FlexRow>
          </>
        )}
      </FormWrapper>
      {type === 'PRIVATE' && (
        <BottomWrapper>
          <FlexRow>
            <Checkbox onChange={noticeHandler} isSelected={noticeChecked} />
            <TextH5B margin="0 0 0 8px" padding="3px 0 0 0" onClick={noticeHandler} pointer>
              ?????? ?????? ?????? ??????????????? ??????????????????.
            </TextH5B>
          </FlexRow>
          <Row />
          <TextB3R color={theme.greyScale65}>
            ???????????? ?????? ?????? ????????? ?????? ?????? ??? ????????? ?????? ????????? ?????? ????????? ??????????????? ?????? ??? ??? ????????????. (??????
            : ?????? ?????? ???????????????, ?????? ?????? ??????)
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
          ??????
        </Button>
      </FixedButton>
    </Container>
  );
};

const Container = styled.main`
  padding-bottom: 56px;
`;

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
