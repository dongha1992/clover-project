import React, { useState, useEffect, useRef, useCallback } from 'react';
import { homePadding, fixedBottom, FlexBetween, theme, FlexCol, FlexRow, customInput, textBody2 } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextH5B, TextH6B, TextB2R, TextB3R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import BorderLine from '@components/Shared/BorderLine';
import { GENDER } from '@pages/signup/optional';
import { Button, RadioButton } from '@components/Shared/Button';
import router from 'next/router';
import { SVGIcon } from '@utils/common';
import { useInterval } from '@hooks/useInterval';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { PHONE_REGX } from '@pages/signup/auth';
import { userAuthTel, userConfirmTel } from '@api/user';
import { removeCookie } from '@utils/common/cookie';
import { SET_LOGIN_SUCCESS } from '@store/user';
import { commonSelector } from '@store/common';
import { userForm } from '@store/user';
import { availabilityEmail, userChangeInfo } from '@api/user';
import Validation from '@components/Pages/User/Validation';
import { EMAIL_REGX } from '@pages/signup/email-password';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import { debounce } from 'lodash-es';
interface IVaildation {
  message: string;
  isValid: boolean;
}

interface IUserInfo {
  nickName: string;
  name: string;
  email: string;
  tel: string;
}

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

  const [userInfo, setUserInfo] = useState<IUserInfo>({ nickName: '', name: '', email: '', tel: '' });

  const authCodeNumberRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);

  const authTimerRef = useRef(300);

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
    dispatch(SET_LOGIN_SUCCESS(false));
    delete sessionStorage.accessToken;
    removeCookie({ name: 'refreshTokenObj' });
    router.push('/mypage');
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

    if (PHONE_REGX.test(value)) {
      setPhoneValidation(true);
    } else {
      setPhoneValidation(false);
    }
    setUserInfo({ ...userInfo, tel: value });
  };

  const getAvailabilityEmail = async () => {
    if (userInfo.email === me?.email) return;
    const {
      data: {
        data: { availability },
      },
    } = await availabilityEmail({ email: userInfo.email });
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
      const { tel } = userInfo;

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

        /* TODO: 인증번호 요청 실패 시 */
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAuthCodeConfirm = async () => {
    if (authCodeNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const { tel } = userInfo;

        try {
          const { data } = await userConfirmTel({ tel, authCode });
          if (data.code === 200) {
            alert('인증 성공 임시임');
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

  const changeEmailHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    const checkEmailRegx = EMAIL_REGX.test(value);
    setUserInfo({ ...userInfo, [name]: value });

    if (checkEmailRegx) {
      setEmailValidataion({
        isValid: true,
        message: '',
      });
    } else {
      setEmailValidataion({
        isValid: false,
        message: '이메일 형식이 올바르지 않습니다.',
      });
    }
  };

  const onChangeUserInfo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const getDeleteUser = async () => {
    // TODO : 정기배송, 주문, 후불결제 등 서비스이용이 남은 경우 탈퇴불가처리 해야됨
    router.push('/mypage/profile/secession');
  };

  const goToChangePassword = () => {
    router.push('/mypage/profile/password');
  };

  const changeMeInfo = async () => {
    const changedBirthDate = birthDateRef.current?.value;

    const reqBody = {
      authCode: authCodeNumberRef?.current?.value ? authCodeNumberRef?.current?.value : null,
      birthDate: changedBirthDate ? changedBirthDate : me?.birthDate!,
      gender: checkGender,
      email: userInfo.email,
      marketingEmailReceived: me?.marketingEmailReceived!,
      marketingPushReceived: me?.marketingPushReceived!,
      marketingSmsReceived: me?.marketingSmsReceived!,
      name: userInfo.name,
      nickName: userInfo.nickName,
      notiPushReceived: me?.notiPushReceived!,
      primePushReceived: me?.primePushReceived!,
      tel: userInfo.tel,
    };
    console.log(reqBody, 'reqBody');

    // temp
    if (birthDateRef.current && birthDateRef.current?.value.length < 10) {
      return alert('생년월일을 정확하게');
    }

    try {
      const { data } = await userChangeInfo(reqBody);
      if (data.code === 200) {
        alert('수정 성공');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setChcekGender(me?.gender!);
    setUserInfo({
      nickName: me?.nickName ? me?.nickName : me?.name!,
      name: me?.name!,
      email: me?.email!,
      tel: me?.tel!,
    });
  }, [me]);

  const isKakao = me?.joinType === 'KAKAO';
  const isNotEmail = me?.joinType === 'EMAIL';

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
            {isKakao ? (
              <KakaoEmailInput>
                <TextInput
                  name="email"
                  placeholder="이메일"
                  onBlur={getAvailabilityEmail}
                  eventHandler={changeEmailHandler}
                  value={userInfo.email || ''}
                />

                <SVGIcon name="kakaoBuble" />
              </KakaoEmailInput>
            ) : (
              <TextInput
                name="email"
                placeholder="이메일"
                onBlur={getAvailabilityEmail}
                eventHandler={changeEmailHandler}
                value={userInfo.email || ''}
              />
            )}
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
            <TextInput name="name" value={userInfo.name || ''} eventHandler={onChangeUserInfo} />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">닉네임</TextH5B>
            <TextInput name="nickName" value={userInfo.nickName || ''} eventHandler={onChangeUserInfo} />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
            <FlexRow>
              <TextInput inputType="number" eventHandler={phoneNumberInputHandler} value={userInfo.tel || ''} />
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
            {/* <BirthdateWrapper>
              <InputContainer>
                <YearPicker
                  defaultValue="YYYY"
                  start={1922} // default is 1900
                  end={2008} // default is current year
                  reverse // default is ASCENDING
                  required={true} // default is false
                  value={birthDayObj.year} // mandatory
                  onChange={(year: string) => {
                    setBirdayObj({ ...birthDayObj, year: Number(year) });
                  }}
                  id="year"
                  name="year"
                  classes="input yearContainer"
                  optionClasses="yearOption"
                />
                <SvgWrapper>
                  <SVGIcon name="triangleDown" />
                </SvgWrapper>
              </InputContainer>
              <InputContainer>
                <MonthPicker
                  defaultValue="MM"
                  numeric // to get months as numbers
                  short // default is full name
                  caps // default is Titlecase
                  endYearGiven // mandatory if end={} is given in YearPicker
                  year={birthDayObj.year} // mandatory
                  required={true} // default is false
                  value={birthDayObj.month} // mandatory
                  onChange={(month: string) => {
                    setBirdayObj({ ...birthDayObj, month: Number(month) });
                  }}
                  id="month"
                  name="month"
                  classes="input monthContainer"
                  optionClasses="monthOption"
                />
                <SvgWrapper>
                  <SVGIcon name="triangleDown" />
                </SvgWrapper>
              </InputContainer>
              <InputContainer>
                <DayPicker
                  defaultValue="DD"
                  year={birthDayObj.year} // mandatory
                  month={birthDayObj.month} // mandatory
                  endYearGiven // mandatory if end={} is given in YearPicker
                  required={true} // default is false
                  value={birthDayObj.day} // mandatory
                  onChange={(day: string) => {
                    setBirdayObj({ ...birthDayObj, day: Number(day) });
                  }}
                  id="day"
                  name="day"
                  classes="input dayContainer"
                  optionClasses="dayOption"
                />
                <SvgWrapper>
                  <SVGIcon name="triangleDown" />
                </SvgWrapper>
              </InputContainer>
            </BirthdateWrapper> */}
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

const BirthdateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  .input {
    ${customInput}
    border: 1px solid ${theme.greyScale15};
    background-color: white;
    ${textBody2}
    color:black
  }

  .yearContainer {
    display: flex;

    .yearOption:first-of-type {
      color: red;
    }
  }
  .monthContainer {
    margin-right: 10px;

    .option {
    }
  }
  .dayContainer {
    .option {
    }
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-right: 10px;
  width: 100%;
`;

const SvgWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 25%;
`;

const KakaoEmailInput = styled.div`
  position: relative;
  .svg {
    position: absolute;
    left: 10%;
  }
`;

export default ProfilePage;
