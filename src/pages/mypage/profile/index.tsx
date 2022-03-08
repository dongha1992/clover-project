import React, { useState, useEffect, useRef, useCallback } from 'react';
import { homePadding, fixedBottom, FlexBetween, theme, FlexCol, FlexRow } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextH5B, TextH6B, TextB2R, TextB3R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import BorderLine from '@components/Shared/BorderLine';
import { GENDER } from '@pages/signup/optional';
import { Button, RadioButton } from '@components/Shared/Button';
import router from 'next/router';
import SVGIcon from '@utils/SVGIcon';
import { useInterval } from '@hooks/useInterval';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { PHONE_REGX } from '@pages/signup/auth';
import { userAuthTel, userConfirmTel } from '@api/user';
import { removeCookie } from '@utils/cookie';
import { SET_LOGIN_SUCCESS } from '@store/user';
import { commonSelector } from '@store/common';
import { userForm } from '@store/user';
import { availabilityEmail, userChangeInfo } from '@api/user';
import Validation from '@components/Pages/User/Validation';
import { EMAIL_REGX } from '@pages/signup/email-password';
interface IVaildation {
  message: string;
  isValid: boolean;
}

/* TODO: 서버에서 받은 정보 어떻게 관리할까 */

const ProfilePage = () => {
  const { me } = useSelector(userForm);

  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [delay, setDelay] = useState<number | null>(null);

  const [emailValidation, setEmailValidataion] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [checkGender, setChcekGender] = useState<string>('');
  const [isAuthTel, setIsAuthTel] = useState(false);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);

  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const authTimerRef = useRef(300);

  const { loginType } = useSelector(commonSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authTimerRef.current < 0) {
      setDelay(null);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < 240) {
      setOneMinuteDisabled(false);
    }
  }, [second]);

  const timerHandler = useCallback((): void => {
    const _minute = Math.floor(authTimerRef.current / 60);
    const _second = Math.floor(authTimerRef.current % 60);

    authTimerRef.current -= 1;

    setMinute(_minute);
    setSecond(_second);
  }, [second, minute]);

  useInterval(timerHandler, delay);

  const logoutHandler = () => {
    if (loginType === 'EMAIL') {
      dispatch(SET_LOGIN_SUCCESS(false));
      delete sessionStorage.accessToken;
      removeCookie({ name: 'refreshTokenObj' });
      router.push('/mypage');
    }
  };

  const otherAuthTelHandler = () => {
    setIsAuthTel(true);
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

  const phoneNumberInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (telRef.current) {
      const tel = telRef.current?.value;
      if (PHONE_REGX.test(tel)) {
        setPhoneValidation(true);
      } else {
        setPhoneValidation(false);
      }
    }
  };

  const getAvailabilityEmail = async () => {
    if (emailRef.current) {
      const email = emailRef.current?.value;
      const {
        data: { data: availability },
      } = await availabilityEmail({ email });
      /* TODO: 탈퇴 res? */

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
    }
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

    try {
      if (telRef.current) {
        const tel = telRef.current?.value.toString();

        const { data } = await userAuthTel({ tel });

        if (data.code === 200) {
          dispatch(
            SET_ALERT({
              alertMessage: `인증번호 전송했습니다.`,
              submitBtnText: '확인',
            })
          );
          setOneMinuteDisabled(true);
          setDelay(1000);
        }
        /* TODO: 인증번호 요청 실패 시 */
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAuthCodeConfirm = async () => {
    if (authCodeNumberRef.current && telRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const tel = telRef.current.value;

        try {
          const { data } = await userConfirmTel({ tel, authCode });
          if (data.code === 200) {
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const checkGenderHandler = (value: string) => {
    setChcekGender(value);
  };

  const changeEmailHandler = (): void => {
    if (emailRef.current) {
      const email = emailRef.current?.value;
      const checkEmailRegx = EMAIL_REGX.test(email);
      if (checkEmailRegx) {
        setEmailValidataion({
          isValid: true,
          message: '',
        });

        /* 이메일 중복 검사 */
        getAvailabilityEmail();
      } else {
        setEmailValidataion({
          isValid: false,
          message: '이메일 형식이 올바르지 않습니다.',
        });
      }
    }
  };

  const getDeleteUser = async () => {
    // TODO : 정기배송, 주문, 후불결제 등 서비스이용이 남은 경우 탈퇴불가처리 해야됨
    router.push('/mypage/profile/secession');
  };

  const goToChangePassword = () => {
    router.push('/mypage/profile/password');
  };

  const changeMeInfo = async () => {
    const changedNickname = nicknameRef.current?.value;
    const changedName = nameRef.current?.value;
    const changedBirthDate = birthDateRef.current?.value;
    const chagnedEmail = emailRef.current?.value;
    const chagnedTel = telRef.current?.value;

    const reqBody = {
      birthDate: changedBirthDate ? changedBirthDate : me?.birthDate!,
      gender: checkGender ? checkGender : me?.gender!,
      email: chagnedEmail ? chagnedEmail : me?.email!,
      marketingEmailReceived: me?.marketingEmailReceived!,
      marketingPushReceived: me?.marketingPushReceived!,
      marketingSmsReceived: me?.marketingSmsReceived!,
      name: changedName ? changedName : me?.name!,
      nickName: changedNickname ? changedNickname : me?.nickName!,
      notiPushReceived: me?.notiPushReceived!,
      primePushReceived: me?.primePushReceived!,
      tel: chagnedTel ? chagnedTel : me?.tel!,
    };

    // temp
    if (birthDateRef.current && birthDateRef.current?.value.length < 10) {
      return alert('생년월일을 정확하게');
    }
    try {
      const { data } = await userChangeInfo(reqBody);
    } catch (error) {
      console.error(error);
    }
  };

  /*TODO: me에서 전달되는 초기값 이렇게 하는 거 좀 거슬림 */
  useEffect(() => {
    setChcekGender(me?.gender!);
  }, [me]);

  return (
    <Container>
      <Wrapper>
        <LoginInfoWrapper>
          <FlexBetween padding="24px 0 ">
            <TextH4B>로그인 정보</TextH4B>
            <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={logoutHandler} pointer>
              로그아웃
            </TextH6B>
          </FlexBetween>
          <NameInputWrapper>
            <TextH5B padding="0 0 9px 0">이메일</TextH5B>
            <TextInput
              placeholder="이메일"
              ref={emailRef}
              eventHandler={changeEmailHandler}
              value={me?.email ? me?.email : ''}
            />
            {!emailValidation.isValid ? (
              <Validation>{emailValidation.message}</Validation>
            ) : (
              <SVGIcon name="confirmCheck" />
            )}
          </NameInputWrapper>
          <FlexCol>
            <TextH5B padding="0 0 9px 0">비밀번호</TextH5B>
            <FlexRow>
              <Button width="86px" onClick={goToChangePassword}>
                변경하기
              </Button>
            </FlexRow>
          </FlexCol>
        </LoginInfoWrapper>
        <BorderLine height={8} margin="32px 0" />
        <UserInfoWrapper>
          <FlexRow padding="0 0 24px 0">
            <TextH4B>회원 정보</TextH4B>
          </FlexRow>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">이름</TextH5B>
            <TextInput value={me?.name} ref={nameRef} />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">닉네임</TextH5B>
            <TextInput value={me?.nickName} ref={nicknameRef} />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
            <FlexRow>
              <TextInput inputType="number" eventHandler={phoneNumberInputHandler} ref={telRef} value={me?.tel} />
              {isAuthTel ? (
                <Button width="40%" margin="0 0 0 8px" onClick={getAuthTel} disabled={oneMinuteDisabled}>
                  요청하기
                </Button>
              ) : (
                <Button width="40%" margin="0 0 0 8px" onClick={otherAuthTelHandler}>
                  다른번호 인증
                </Button>
              )}
            </FlexRow>
            {isAuthTel && (
              <ConfirmWrapper>
                <TextInput
                  placeholder="인증 번호 입력"
                  eventHandler={authCodeInputHandler}
                  ref={authCodeNumberRef}
                  inputType="number"
                />
                <Button width="40%" margin="0 0 0 8px" disabled={!authCodeValidation} onClick={getAuthCodeConfirm}>
                  확인
                </Button>
                {authCodeValidation && <SVGIcon name="confirmCheck" />}
                {delay && (
                  <TimerWrapper>
                    <TextB3R color={theme.brandColor}>
                      {minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
                    </TextB3R>
                  </TimerWrapper>
                )}
              </ConfirmWrapper>
            )}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">생년월일</TextH5B>
            <TextInput value={me?.birthDate} ref={birthDateRef} placeholder="YYYY-MM-DD" />
          </FlexCol>
          <FlexCol>
            <TextH5B>성별</TextH5B>
            <FlexRow padding="17px 0 0 0">
              {GENDER.map((item, index) => {
                const isSelected = checkGender === item.value;
                return (
                  <FlexRow padding="0 16px 0 0" key={index}>
                    <RadioButton onChange={() => checkGenderHandler(item.value)} isSelected={isSelected} />
                    {isSelected ? (
                      <TextH5B padding="0 0 0 8px">{item.text}</TextH5B>
                    ) : (
                      <TextB2R padding="0 0 0 8px">{item.text}</TextB2R>
                    )}
                  </FlexRow>
                );
              })}
            </FlexRow>
          </FlexCol>
        </UserInfoWrapper>
        <BorderLine height={8} margin="32px 0" />
        <DeleteUser onClick={getDeleteUser}>
          <TextH5B color={theme.greyScale65} textDecoration="underline">
            탈퇴하기
          </TextH5B>
        </DeleteUser>
      </Wrapper>
      <BtnWrapper onClick={changeMeInfo}>
        <Button height="100%">수정하기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div``;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

const NameInputWrapper = styled.div`
  position: relative;
  padding: 0 0 24px 0;

  > svg {
    position: absolute;
    right: 5%;
    bottom: 42%;
  }
`;

const LoginInfoWrapper = styled.div`
  ${homePadding}
  display: flex;
  flex-direction: column;
`;

const ConfirmWrapper = styled.div`
  margin-top: 8px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  > svg {
    position: absolute;
    right: 35%;
    bottom: 40%;
  }
`;

const TimerWrapper = styled.div`
  position: absolute;
  left: 55%;
`;

const UserInfoWrapper = styled.div`
  ${homePadding}
`;

const DeleteUser = styled.div`
  ${homePadding}
  margin: 32px 0 104px 0;
`;

export default ProfilePage;
