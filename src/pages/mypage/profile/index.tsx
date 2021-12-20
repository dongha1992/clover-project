import {
  homePadding,
  fixedBottom,
  FlexBetween,
  theme,
  FlexCol,
  FlexRow,
} from '@styles/theme';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Button from '@components/Shared/Button';
import {
  TextH4B,
  TextH5B,
  TextH6B,
  TextB2R,
  TextB3R,
} from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import BorderLine from '@components/Shared/BorderLine';
import { GENDER } from '@pages/signup/optional';
import { RadioButton } from '@components/Shared/Button/RadioButton';
import router from 'next/router';
import SVGIcon from '@utils/SVGIcon';
import { useInterval } from '@hooks/useInterval';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { PHONE_REGX } from '@pages/signup/auth';
import { userAuthTel, userConfirmTel } from '@api/user';

function profile() {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [checkGender, setChcekGender] = useState<number>(1);
  const [isAuthTel, setIsAuthTel] = useState(false);
  const [delay, setDelay] = useState<number | null>(null);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);

  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const authTimerRef = useRef(2000);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authTimerRef.current < 0) {
      setDelay(null);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < 440) {
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

  const logoutHandler = () => {};

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

  const phoneNumberInputHandler = () => {
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

    try {
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
        }
        /* TODO: 인증번호 요청 실패 시 */
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAuthCodeConfirm = async () => {
    if (authCodeNumberRef.current && phoneNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const tel = phoneNumberRef.current.value;

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

  const checkGenderHandler = (id: number) => {
    setChcekGender(id);
  };

  const getDeleteUser = async () => {};

  const goToChangePassword = () => {
    router.push('/mypage/profile/password');
  };

  return (
    <Container>
      <Wrapper>
        <LoginInfoWrapper>
          <FlexBetween padding="24px 0 ">
            <TextH4B>로그인 정보</TextH4B>
            <TextH6B
              color={theme.greyScale65}
              textDecoration="underline"
              onClick={logoutHandler}
            >
              로그아웃
            </TextH6B>
          </FlexBetween>
          <FlexCol padding="0 0 24px 0 ">
            <TextH5B padding="0 0 9px 0">이메일</TextH5B>
            <TextInput />
          </FlexCol>
          <FlexCol>
            <TextH5B padding="0 0 9px 0">비밀번호</TextH5B>
            <FlexRow>
              <TextInput />
              <Button
                width="30%"
                margin="0 0 0 8px"
                onClick={goToChangePassword}
              >
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
            <TextInput />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">닉테임</TextH5B>
            <TextInput />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
            <FlexRow>
              <TextInput
                inputType="number"
                eventHandler={phoneNumberInputHandler}
                ref={phoneNumberRef}
              />
              {isAuthTel ? (
                <Button
                  width="40%"
                  margin="0 0 0 8px"
                  onClick={getAuthTel}
                  disabled={oneMinuteDisabled}
                >
                  요청하기
                </Button>
              ) : (
                <Button
                  width="40%"
                  margin="0 0 0 8px"
                  onClick={otherAuthTelHandler}
                >
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
                <Button
                  width="40%"
                  margin="0 0 0 8px"
                  disabled={!authCodeValidation}
                  onClick={getAuthCodeConfirm}
                >
                  확인
                </Button>
                {authCodeValidation && <SVGIcon name="confirmCheck" />}
                {delay && (
                  <TimerWrapper>
                    <TextB3R color={theme.brandColor}>
                      {minute < 10 ? `0${minute}` : minute}:
                      {second < 10 ? `0${second}` : second}
                    </TextB3R>
                  </TimerWrapper>
                )}
              </ConfirmWrapper>
            )}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">생년월일</TextH5B>
            <TextInput />
          </FlexCol>
          <FlexCol>
            <TextH5B>성별</TextH5B>
            <FlexRow padding="17px 0 0 0">
              {GENDER.map((item, index) => {
                return (
                  <FlexRow padding="0 16px 0 0" key={index}>
                    <RadioButton
                      onChange={() => checkGenderHandler(item.id)}
                      isSelected={checkGender === item.id}
                    />
                    {checkGender === item.id ? (
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
      <BtnWrapper>
        <Button height="100%">수정하기</Button>
      </BtnWrapper>
    </Container>
  );
}

const Container = styled.div``;

const Wrapper = styled.div``;

const BtnWrapper = styled.div`
  ${fixedBottom}
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

export default profile;
