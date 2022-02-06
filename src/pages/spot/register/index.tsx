import React, { useRef, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme, FlexRow, fixedBottom } from '@styles/theme';
import {
  TextH1B,
  TextH4B,
  TextB3R,
  TextH5B,
  TextB2R,
} from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { useRouter } from 'next/router';
import Checkbox from '@components/Shared/Checkbox';
import { Button } from '@components/Shared/Button';
import { setBottomSheet } from '@store/bottomSheet';
import { OptionsSheet } from '@components/Pages/Spot';
import SVGIcon from '@utils/SVGIcon';
import { useSelector, useDispatch } from 'react-redux';
import { spotSelector, SET_SPOT_REGISTRATIONS_INFO} from '@store/spot';

const RegisterPage = () => {
  const { spotLocation, spotsRegistrationInfo, spotsRegistrationOptions } = useSelector(spotSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const placeRef = useRef<HTMLInputElement>(null);
  const pickUpEtcRef = useRef<HTMLInputElement>(null);
  const placeEtcRef = useRef<HTMLInputElement>(null);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);

  const goToSubmit = (): void => {
    if(!noticeChecked){
      return;
    };
    if (type === 'owner') {
      router.push({
        pathname: '/spot/register/spot-onboarding',
        query: { type },
      });
    } else {
      router.push({
        pathname: '/spot/register/submit',
        query: { type },
      });
    }
  };

  const selectOptions = useCallback((tab) => {
    dispatch(
      setBottomSheet({
        content: <OptionsSheet tab={tab} />,
      })
    );
  }, []);

  const goToLocation = () => {
    router.push({
      pathname: '/spot/location',
      query: { type },
    });
  };

  const placeInputHandler = () => {
    if(placeRef.current){
      const selectedOptions = {
        placeName: placeRef.current?.value,
        pickupLocationEtc: spotsRegistrationInfo.pickupLocationEtc,
        placeTypeEtc: spotsRegistrationInfo.placeTypeEtc,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    };
  };

  const pickUpEtcInputHandler = () => {
    if(pickUpEtcRef.current){
      const selectedOptions = {
        placeName:spotsRegistrationInfo.placeName,
        pickupLocationEtc: pickUpEtcRef.current?.value,
        placeTypeEtc: spotsRegistrationInfo.placeTypeEtc,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    };
  };

  const placeEtcInputHandler = () => {
    if(placeEtcRef.current){
      const selectedOptions = {
        placeName: spotsRegistrationInfo.placeName,
        pickupLocationEtc: spotsRegistrationInfo.pickupLocationEtc,
        placeTypeEtc: placeEtcRef.current?.value,
      };
      dispatch(SET_SPOT_REGISTRATIONS_INFO(selectedOptions));
    };
  };

  const noticeHandler = () => {
      setNoticeChecked(!noticeChecked);
  };

  return (
    <Container>
      <TextH1B margin="24px 24px 56px 24px">
        신청하실 장소가
        <br />
        어디신가요?
      </TextH1B>
      <FormWrapper>
        <Wrapper >
          <TextH4B margin="0 0 16px 0">주소</TextH4B>
          <LocationWrapper onClick={goToLocation} >
            {
              !spotLocation.address?.length ?
                <TextH4B center color={theme.black}>장소 찾기</TextH4B>
              :
                <>
                  <TextH4B>{`${spotLocation.address} ${spotLocation.bdNm}`}</TextH4B>
                  <TextB2R>{spotLocation.addressDetail}</TextB2R>
                </>
            }
          </LocationWrapper>
        </Wrapper>
        <Wrapper>
          <TextH4B margin="0 0 16px 0">장소명</TextH4B>
          <TextInput
            ref={placeRef}
            eventHandler={placeInputHandler}
            value={spotsRegistrationInfo.placeName?.length ? spotsRegistrationInfo.placeName : null}
            placeholder={
              type === 'private' ? '회사 및 학교 상호입력' : '상호명'
            }
          />
        </Wrapper>
        {type === 'private' && (
          <Wrapper>
            <TextH4B margin="0 0 16px 0">픽업장소</TextH4B>
            <Button
              justifyContent="space-between"
              backgroundColor={theme.white}
              padding="12px 16px"
              color={theme.greyScale45}
              fontWeight={400}
              borderGrey15
              pointer
              onClick={() => selectOptions('pickUp')}
            >
              {
                spotsRegistrationOptions.pickupLocationTypeOptions?.name?.length ?
                <TextB2R color={theme.black}>{spotsRegistrationOptions.pickupLocationTypeOptions?.name} </TextB2R>
                :
                '픽업 장소 선택'
              }
              <SVGIcon name="triangleDown" />
            </Button>
            {
              spotsRegistrationOptions.pickupLocationTypeOptions?.value === 'ETC' &&
              <TextInput 
                margin='8px 0 0 0' 
                placeholder='기타 픽업 장소 입력' 
                ref={pickUpEtcRef} 
                eventHandler={pickUpEtcInputHandler}
                value={spotsRegistrationInfo.pickupLocationEtc?.length ? spotsRegistrationInfo.pickupLocationEtc : null}
              />
            }
          </Wrapper>
        )}
        <Wrapper>
          <TextH4B margin="0 0 16px 0">장소 종류</TextH4B>
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
            {
              spotsRegistrationOptions.placeTypeOptions?.name?.length ?
              <TextB2R color={theme.black}>{spotsRegistrationOptions.placeTypeOptions?.name} </TextB2R>
              :
              '공간 형태 선택'
            }
            <SVGIcon name="triangleDown" />
          </Button>
          {
            spotsRegistrationOptions.placeTypeOptions?.value === 'ETC' &&
            <TextInput 
              margin='8px 0 0 0' 
              placeholder='기타 장소 종류 입력' 
              ref={placeEtcRef} 
              eventHandler={placeEtcInputHandler} 
              value={spotsRegistrationInfo.placeTypeEtc?.length ? spotsRegistrationInfo.placeTypeEtc : null}
            />
          }
        </Wrapper>
        {type === 'private' && (
          <Wrapper>
            <TextH4B margin="0 0 16px 0">점심시간</TextH4B>
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
              {
                spotsRegistrationOptions.lunchTimeOptions?.name?.length ?
                <TextB2R color={theme.black}>{spotsRegistrationOptions.lunchTimeOptions?.name} </TextB2R>
                :
                '시간대 선택'
              }
              <SVGIcon name="triangleDown" />
            </Button>
          </Wrapper>
        )}
      </FormWrapper>
      {type === 'private' && (
        <BottomWrapper>
          <FlexRow>
            <Checkbox onChange={noticeHandler} isSelected={noticeChecked} />
            <TextH5B margin="0 0 0 8px" padding='3px 0 0 0'>
              픽업 장소 선정 유의사항을 확인했습니다.
            </TextH5B>
          </FlexRow>
          <Row />
          <TextB3R color={theme.greyScale65}>
            픽업장소 배송 시에 외부인 출입 제한 및 복잡한 출입 절차가 있을
            경우에 픽업장소가 변경 될 수 있습니다. (예시 : 직원 전용 엘레베이터,
            출입 제한 건물)
          </TextB3R>
        </BottomWrapper>
      )}
      <FixedButton onClick={goToSubmit}>
        <Button 
          borderRadius="0" 
          height="100%"
          padding='10px 0 0 0' 
          backgroundColor={!noticeChecked ? theme.greyScale6  : theme.balck}
          >다음</Button>
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
