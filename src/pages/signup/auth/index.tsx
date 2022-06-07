import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B, TextB3R } from '@components/Shared/Text';
import { homePadding, fixedBottom, theme } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { useInterval } from '@hooks/useInterval';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { SVGIcon } from '@utils/common';
import { useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER } from '@store/user';
import { userAuthTel, userConfirmTel, availabilityEmail } from '@api/user';
import { IUser } from '@store/user';
import Validation from '@components/Pages/User/Validation';
import { IVaildation } from '@pages/signup/email-password';
import { EMAIL_REGX } from '@pages/signup/email-password';

export const PHONE_REGX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
export const NAME_REGX = /^[ㄱ-ㅎ|가-힣|a-z|A-Z]{2,20}$/;

const SignupAuthPage = () => {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [delay, setDelay] = useState<number | null>(null);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [nameValidation, setNameValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [authCodeConfirm, setAuthCodeConfirm] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState<IUser['signupUser']>({});
  const [isOverTime, setIsOverTime] = useState<boolean>(false);

  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const authTimerRef = useRef(300);
  // let authTimerRef = useRef(5);

  const [emailValidation, setEmailValidataion] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

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
      setIsOverTime(true);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < 240) {
      setOneMinuteDisabled(false);
    }
  }, [second]);

  const nameInputHandler = (e: any): void => {
    const { value } = e.target;
    const lengthCheck = value.length < 2 || value.length > 20;

    if (!NAME_REGX.test(value) || lengthCheck) {
      setNameValidation(false);
    } else {
      setNameValidation(true);
    }
    setSignUpInfo({ ...signUpInfo, name: value });
  };

  const phoneNumberInputHandler = (e: any): void => {
    const { value } = e.target;
    if (PHONE_REGX.test(value)) {
      setPhoneValidation(true);
    } else {
      setPhoneValidation(false);
    }
    setSignUpInfo({ ...signUpInfo, tel: value });
  };

  const emailInputHandler = (e: any) => {
    const { value } = e.target;

    setSignUpInfo({ ...signUpInfo, email: value });
  };

  const validEmailHandler = () => {
    getAvailabilityEmail();

    if (EMAIL_REGX.test(signupUser?.email!)) {
      setEmailValidataion({ message: '', isValid: true });
    } else {
      setEmailValidataion({ message: '길이는 100자 이내입니다.', isValid: false });
    }
  };

  const getAvailabilityEmail = async () => {
    const email = signUpInfo.email!;
    const {
      data: { data: availability },
    } = await availabilityEmail({ email });

    if (availability) {
      setEmailValidataion({
        isValid: true,
        message: '',
      });
    } else {
      setEmailValidataion({
        isValid: false,
        message: '사용 중인 이메일 주소입니다.',
      });
    }
  };

  const resetTimer = () => {
    authTimerRef.current = 300;
  };

  const getAuthTel = async () => {
    if (!phoneValidation) {
      dispatch(
        SET_ALERT({
          alertMessage: `잘못된 휴대폰 번호 입니다.\n\확인 후 다시 시도 해 주세요.`,
          submitBtnText: '확인',
        })
      );
      return;
    }

    if (oneMinuteDisabled) {
      dispatch(SET_ALERT({ alertMessage: '잠시 후 재요청해 주세요.' }));
      return;
    }

    const { tel } = signUpInfo;
    try {
      const { data } = await userAuthTel({ tel: tel! });

      if (data.code === 200) {
        dispatch(
          SET_ALERT({
            alertMessage: `인증번호 전송했습니다.`,
            submitBtnText: '확인',
          })
        );
        setOneMinuteDisabled(true);
        setDelay(1000);
        resetTimer();
        if (isOverTime) {
          setIsOverTime(false);
          resetTimer();
        }
      }
    } catch (error: any) {
      if (error.code === 2000) {
        dispatch(
          SET_ALERT({
            alertMessage: `이메일로 가입된 계정이 있습니다.`,
          })
        );
      } else if (error.code === 2001) {
        dispatch(
          SET_ALERT({
            alertMessage: '하루 인증 요청 제한 횟수 10회를 초과했습니다.',
          })
        );
      } else {
        dispatch(
          SET_ALERT({
            alertMessage: '알 수 없는 에러 발생',
          })
        );
      }
      console.error(error);
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
    if (!authCodeValidation || isOverTime) return;

    if (authCodeNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const { tel } = signUpInfo;
        try {
          const { data } = await userConfirmTel({ tel: tel!, authCode });
          if (data.code === 200) {
            setAuthCodeConfirm(true);
            setDelay(null);
            dispatch(SET_ALERT({ alertMessage: '인증이 완료되었습니다.', submitBtnText: '확인' }));
          }
        } catch (error: any) {
          if (error.code === 2002) {
            dispatch(SET_ALERT({ alertMessage: '인증번호가 올바르지 않습니다.', submitBtnText: '확인' }));
          } else {
            dispatch(SET_ALERT({ alertMessage: error.message, submitBtnText: '확인' }));
          }
          setAuthCodeConfirm(false);

          console.error(error);
        }
      }
    }
  };

  const goToEmailAndPassword = () => {
    if (!nameValidation || !phoneValidation || !authCodeConfirm) {
      return;
    }
    const isApple = signUpInfo.loginType === 'APPLE';

    dispatch(
      SET_SIGNUP_USER({
        name: signUpInfo.name,
        tel: signUpInfo.tel,
        authCode: authCodeNumberRef.current?.value,
        email: isApple ? signUpInfo.email : '',
      })
    );
    if (isApple) {
      router.push('/signup/optional');
    } else {
      router.push('/signup/email-password');
    }
  };

  useEffect(() => {
    const { name, tel, authCode } = signupUser;
    if (name && tel && authCode) {
      setNameValidation(true);
      setPhoneValidation(true);
      setAuthCodeConfirm(true);
    }
  }, [signupUser]);

  useEffect(() => {
    setSignUpInfo({ ...signupUser });
  }, [signupUser]);

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
            eventHandler={nameInputHandler}
            value={signUpInfo?.name ? signUpInfo?.name : ''}
          />
          {nameValidation && <SVGIcon name="confirmCheck" />}
        </NameInputWrapper>
        {signUpInfo?.name?.length! > 0 && !nameValidation && (
          <Validation>2~20자 이내 / 한글, 영문만 입력 가능해요.</Validation>
        )}
        <PhoneNumberInputWrapper>
          <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
          <AuthenficationWrapper>
            <TextInput
              placeholder="휴대폰 번호 (-제외)"
              eventHandler={phoneNumberInputHandler}
              inputType="number"
              value={signUpInfo?.tel ? signUpInfo?.tel : ''}
            />
            <Button width="30%" margin="0 0 0 8px" height="48px" onClick={getAuthTel}>
              {delay ? '재요청' : '인증요청'}
            </Button>
            {phoneValidation && <SVGIcon name="confirmCheck" />}
          </AuthenficationWrapper>
          {!phoneValidation && signUpInfo?.tel?.length! > 0 && (
            <Validation>휴대폰 번호를 정확히 입력해주세요.</Validation>
          )}
          <ConfirmWrapper>
            <TextInput
              placeholder="인증 번호 입력"
              ref={authCodeNumberRef}
              inputType="number"
              eventHandler={authCodeInputHandler}
            />
            <Button
              width="30%"
              margin="0 0 0 8px"
              height="48px"
              disabled={!authCodeValidation || isOverTime}
              onClick={getAuthCodeConfirm}
            >
              확인
            </Button>
            {(authCodeConfirm || signUpInfo.authCode) && <SVGIcon name="confirmCheck" />}
            {delay && (
              <TimerWrapper>
                <TextB3R color={theme.brandColor}>
                  0{minute}: {second < 10 ? `0${second}` : second}
                </TextB3R>
              </TimerWrapper>
            )}
          </ConfirmWrapper>
        </PhoneNumberInputWrapper>
        {isOverTime && <Validation>인증 유효시간이 지났습니다.</Validation>}
        {signUpInfo.loginType === 'APPLE' && (
          <EmailInputWrapper>
            <TextH5B padding="0 0 9px 0">이메일</TextH5B>
            <TextInput
              placeholder="이메일"
              eventHandler={emailInputHandler}
              value={signupUser?.email}
              onBlur={validEmailHandler}
            />
            {!emailValidation.isValid ? (
              <Validation>{emailValidation.message}</Validation>
            ) : (
              <SVGIcon name="confirmCheck" />
            )}
          </EmailInputWrapper>
        )}
      </Wrapper>
      <NextBtnWrapper onClick={goToEmailAndPassword}>
        <Button disabled={!isAllValid} height="100%" borderRadius="0">
          다음
        </Button>
      </NextBtnWrapper>
    </Container>
  );
};

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
  margin-top: 8px;
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

const TelHelper = styled.div``;

const EmailInputWrapper = styled.div`
  position: relative;
  margin-top: 24px;

  > svg {
    position: absolute;
    right: 5%;
    bottom: 25%;
  }
`;

export default React.memo(SignupAuthPage);
