import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B, TextB3R } from '@components/Text';
import { homePadding, fixedBottom, theme } from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import { Api } from '@api/index';
import router from 'next/router';
import { useInterval } from '@hooks/useInterval';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import SVGIcon from '@utils/SVGIcon';
import { useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER } from '@store/user';
import { userAuthTel, userConfirmTel } from '@api/v2';

export const PHONE_REGX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
export const NAME_REGX = /^[ㄱ-ㅎ|가-힣|a-z|A-Z]{2,20}$/;

function signupAuth() {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [delay, setDelay] = useState<number | null>(1000);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [nameValidation, setNameValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [authCodeConfirm, setAuthCodeConfirm] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const authTimerRef = useRef(2);

  const dispatch = useDispatch();
  const { signupUser } = useSelector(userForm);

  const timerHandler = useCallback((): void => {
    const _minute = Math.floor(authTimerRef.current / 60);
    const _second = Math.floor(authTimerRef.current % 60);

    authTimerRef.current -= 1;

    setMinute(_minute);
    setSecond(_second);
  }, [second, minute]);

  useInterval(timerHandler, delay);

  useEffect(() => {
    if (authTimerRef.current < 0) {
      setDelay(null);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < 440) {
      setOneMinuteDisabled(false);
    }
  }, [second]);

  const nameInputHandler = (): void => {
    if (nameRef.current) {
      const name = nameRef.current?.value;
      if (NAME_REGX.test(name)) {
        setNameValidation(true);
      } else {
        setNameValidation(false);
      }
    }
  };

  const phoneNumberInputHandler = (): void => {
    if (phoneNumberRef.current) {
      const tel = phoneNumberRef.current?.value;
      if (PHONE_REGX.test(tel)) {
        setPhoneValidation(true);
      } else {
        setPhoneValidation(false);
      }
    }
  };

  const getAuthTel = async () => {
    if (!phoneValidation) {
      dispatch(
        setAlert({
          alertMessage: `잘못된 휴대폰 번호 입니다.\n\확인 후 다시 시도 해 주세요.`,
          submitBtnText: '확인',
        })
      );
      return;
    }

    if (phoneNumberRef.current) {
      const tel = phoneNumberRef.current?.value.toString();

      const { data } = await userAuthTel({ tel });

      if (data.code === 200) {
        dispatch(
          setAlert({
            alertMessage: `인증번호 전송했습니다.`,
            submitBtnText: '확인',
          })
        );
        setOneMinuteDisabled(true);
        setDelay(1000);
      } else {
        return;
        /* TODO: 인증번호 요청 실패 시 */
      }
    }
  };

  const authCodeInputHandler = () => {
    if (authCodeNumberRef.current) {
      const authCode = authCodeNumberRef.current?.value;
      if (authCode.length > 5) {
        setAuthCodeValidation(true);
      } else {
        setAuthCodeValidation(false);
      }
    }
  };

  const getAuthCodeConfirm = async () => {
    if (authCodeNumberRef.current && phoneNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const tel = phoneNumberRef.current.value;

        const { data } = await userConfirmTel({ tel, authCode });

        if (data) {
          setAuthCodeConfirm(true);
        } else {
          setAuthCodeConfirm(false);
        }
      }
    }
  };

  const goToEmailAndPassword = () => {
    if (!nameValidation || !phoneValidation || !authCodeConfirm) {
      return;
    }

    dispatch(
      SET_SIGNUP_USER({
        name: nameRef.current?.value,
        tel: phoneNumberRef.current?.value,
        authCode: authCodeNumberRef.current?.value,
      })
    );
    router.push('/signup/email-password');
  };

  const isAllValid = nameValidation && phoneValidation && authCodeConfirm;

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>본인확인을 위해</TextH2B>
          <TextH2B>인증을 진행해 주세요.</TextH2B>
        </TextWrap>
        <NameInputWrapper>
          <TextH5B padding="0 0 9px 0">이름</TextH5B>
          <TextInput
            placeholder="이름"
            ref={nameRef}
            eventHandler={nameInputHandler}
            value={signupUser.name ? signupUser.name : ''}
          />
          {nameValidation && <SVGIcon name="confirmCheck" />}
        </NameInputWrapper>
        <PhoneNumberInputWrapper>
          <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
          <AuthenficationWrapper>
            <TextInput
              placeholder="휴대폰 번호"
              ref={phoneNumberRef}
              eventHandler={phoneNumberInputHandler}
              inputType="number"
              value={signupUser.tel ? signupUser.tel : ''}
            />
            <Button
              width="30%"
              margin="0 0 0 8px"
              height="48px"
              onClick={getAuthTel}
              disabled={oneMinuteDisabled}
            >
              인증 요청
            </Button>
            {phoneValidation && <SVGIcon name="confirmCheck" />}
          </AuthenficationWrapper>
          <ConfirmWrapper>
            <TextInput
              placeholder="인증 번호 입력"
              eventHandler={authCodeInputHandler}
              ref={authCodeNumberRef}
              inputType="number"
            />
            <Button
              width="30%"
              margin="0 0 0 8px"
              height="48px"
              disabled={!authCodeValidation}
              onClick={getAuthCodeConfirm}
            >
              확인
            </Button>
            {authCodeValidation && <SVGIcon name="confirmCheck" />}
            {delay && (
              <TimerWrapper>
                <TextB3R color={theme.brandColor}>
                  0{minute}: {second < 10 ? `0${second}` : second}
                </TextB3R>
              </TimerWrapper>
            )}
          </ConfirmWrapper>
        </PhoneNumberInputWrapper>
      </Wrapper>
      <NextBtnWrapper onClick={goToEmailAndPassword}>
        <Button disabled={!isAllValid} height="100%" borderRadius="0">
          다음
        </Button>
      </NextBtnWrapper>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div``;
const TextWrap = styled.div`
  padding: 32px 0 56px 0;
`;

const NameInputWrapper = styled.div`
  position: relative;
  > svg {
    position: absolute;
    right: 15px;
    bottom: 25%;
  }
`;

const PhoneNumberInputWrapper = styled.div`
  margin-top: 24px;
`;

const AuthenficationWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
  > svg {
    position: absolute;
    right: 30%;
    bottom: 40%;
  }
`;
const ConfirmWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  > svg {
    position: absolute;
    right: 30%;
    bottom: 40%;
  }
`;

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

const TimerWrapper = styled.div`
  position: absolute;
  left: 60%;
`;

export default React.memo(signupAuth);
