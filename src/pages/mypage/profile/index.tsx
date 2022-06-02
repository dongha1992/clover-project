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
import { userForm, INIT_USER } from '@store/user';
import { availabilityEmail, userChangeInfo } from '@api/user';
import Validation from '@components/Pages/User/Validation';
import { EMAIL_REGX } from '@pages/signup/email-password';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import { getFormatTime } from '@utils/destination';
import { NAME_REGX } from '@constants/regex';
interface IVaildation {
  message: string;
  isValid: boolean;
}

interface IUserInfo {
  nickName: string;
  name: string;
  email: string;
  tel: string;
  year: number;
  month: number;
  day: number;
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
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    nickName: '',
    name: '',
    email: '',
    tel: '',
    year: 0,
    month: -1,
    day: 0,
  });

  const [authCodeConfirm, setAuthCodeConfirm] = useState<boolean>(false);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);
  const authCodeNumberRef = useRef<HTMLInputElement>(null);

  let authTimerRef = useRef(300);
  // let authTimerRef = useRef(5);

  const dispatch = useDispatch();

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
    dispatch(INIT_USER());
    delete sessionStorage.accessToken;
    removeCookie({ name: 'refreshTokenObj' });
    localStorage.removeItem('persist:nextjs');

    router.push('/mypage');
  };

  const otherAuthTelHandler = () => {
    setIsAuthTel(true);
    setUserInfo({ ...userInfo, tel: '' });
    setPhoneValidation(false);
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
    if (userInfo.tel.length > 0 && !phoneValidation) {
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
        if (isOverTime) {
          setIsOverTime(false);
          authTimerRef.current = 5;
        }
      }
    } catch (error: any) {
      if (error.code === 2000) {
        dispatch(
          SET_ALERT({
            alertMessage: '해당 전화번호로 이미 가입된 계정이 있습니다.',
          })
        );
      } else if (error.code === 2001) {
        dispatch(
          SET_ALERT({
            alertMessage: '전화번호 인증 횟수를 초과하였습니다.(하루 5회)',
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

  const getAuthCodeConfirm = async () => {
    if (!authCodeValidation || authCodeConfirm || isOverTime) return;
    if (authCodeNumberRef.current) {
      if (phoneValidation && authCodeValidation) {
        const authCode = authCodeNumberRef.current.value;
        const { tel } = userInfo;

        try {
          const { data } = await userConfirmTel({ tel, authCode });
          if (data.code === 200) {
            dispatch(SET_ALERT({ alertMessage: '인증이 완료되었습니다.' }));
            setAuthCodeConfirm(true);
            setDelay(null);
          }
        } catch (error: any) {
          dispatch(SET_ALERT({ alertMessage: '인증번호가 올바르지 않습니다.' }));
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
    if (!isValidName) return;
    const birthDate = `${userInfo.year}-${getFormatTime(userInfo.month + 1)}-${getFormatTime(userInfo.day)}`;

    const reqBody = {
      authCode: authCodeNumberRef?.current?.value ? authCodeNumberRef?.current?.value : null,
      birthDate: birthDate,
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

    try {
      const { data } = await userChangeInfo(reqBody);
      if (data.code === 200) {
        dispatch(
          SET_ALERT({
            alertMessage: '수정을 성공하였습니다.',
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkNameValid = () => {
    if (!NAME_REGX.test(userInfo.name)) {
      setIsValidName(false);
    } else {
      setIsValidName(true);
    }
  };

  const checkPhontValid = () => {
    if (PHONE_REGX.test(userInfo.tel)) {
      setPhoneValidation(true);
    } else {
      setPhoneValidation(false);
    }
  };

  const telKeyPressHandler = (e: any) => {
    if (e.key === 'Enter') {
      getAuthTel();
    }
  };

  useEffect(() => {
    const toArrayBirthdate = me?.birthDate && me?.birthDate?.split('-');
    const hasBirthDate = toArrayBirthdate?.length! > 0;

    let year, month, day;

    if (toArrayBirthdate) {
      year = toArrayBirthdate[0]!;
      month = toArrayBirthdate[1]!;
      day = toArrayBirthdate[2]!;
    }

    setChcekGender(me?.gender!);
    setUserInfo({
      ...userInfo,
      nickName: me?.nickName ? me?.nickName : me?.name!,
      name: me?.name!,
      email: me?.email!,
      tel: me?.tel!,
      year: hasBirthDate ? Number(year) : 0,
      month: hasBirthDate ? Number(month) - 1 : -1,
      day: hasBirthDate ? Number(day) : 0,
    });
    checkPhontValid();
  }, [me]);

  const isKakao = me?.joinType === 'KAKAO';
  const isNotEmail = me?.joinType !== 'EMAIL';

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
            {isNotEmail ? (
              <EmailInput>
                <TextInput
                  name="email"
                  placeholder="이메일"
                  onBlur={getAvailabilityEmail}
                  eventHandler={changeEmailHandler}
                  value={userInfo.email || ''}
                  disabled={me?.emailConfirmed}
                />
                <SVGIcon name={isKakao ? 'kakaoBuble' : 'appleIcon'} color={theme.black} />
              </EmailInput>
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
          {!isNotEmail && (
            <FlexCol>
              <TextH5B padding="0 0 9px 0">비밀번호</TextH5B>
              <FlexRow>
                <Button width="86px" onClick={goToChangePassword}>
                  변경하기
                </Button>
              </FlexRow>
            </FlexCol>
          )}
        </LoginInfoWrapper>
        <BorderLine height={8} margin="32px 0" />
        <UserInfoWrapper>
          <FlexRow padding="0 0 24px 0">
            <TextH4B>회원 정보</TextH4B>
          </FlexRow>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">이름</TextH5B>
            <TextInput
              name="name"
              value={userInfo.name || ''}
              eventHandler={onChangeUserInfo}
              onBlur={checkNameValid}
            />
            {!isValidName && (
              <TextB3R color={theme.systemRed}>최소 2자 최대 20자 이내, 한글/영문만 입력 가능해요.</TextB3R>
            )}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">닉네임</TextH5B>
            <TextInput name="nickName" value={userInfo.nickName || ''} eventHandler={onChangeUserInfo} />
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
            <FlexRow>
              <TextInput
                inputType="number"
                eventHandler={phoneNumberInputHandler}
                value={userInfo.tel || ''}
                disabled={!isAuthTel}
                keyPressHandler={telKeyPressHandler}
              />
              {isAuthTel ? (
                <Button width="40%" margin="0 0 0 8px" onClick={getAuthTel} disabled={oneMinuteDisabled}>
                  {delay ? '재전송' : '요청하기'}
                </Button>
              ) : (
                <Button width="40%" margin="0 0 0 8px" onClick={otherAuthTelHandler}>
                  다른번호 인증
                </Button>
              )}
            </FlexRow>
            <PhoneValidCheck>
              {isAuthTel && !phoneValidation && userInfo.tel.length > 0 && (
                <Validation>휴대폰 번호를 정확히 입력해주세요.</Validation>
              )}
              {isAuthTel && phoneValidation && <SVGIcon name="confirmCheck" />}
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
                    disabled={!authCodeValidation || authCodeConfirm || isOverTime}
                    onClick={getAuthCodeConfirm}
                  >
                    확인
                  </Button>
                  {authCodeConfirm && <SVGIcon name="confirmCheck" />}
                  {delay && (
                    <TimerWrapper>
                      <TextB3R color={theme.brandColor}>
                        {minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
                      </TextB3R>
                    </TimerWrapper>
                  )}
                </ConfirmWrapper>
              )}
            </PhoneValidCheck>
            {isOverTime && <Validation>인증 유효시간이 지났습니다.</Validation>}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">생년월일</TextH5B>
            <BirthdateWrapper>
              <InputContainer>
                <YearPicker
                  defaultValue="YYYY"
                  start={1922} // default is 1900
                  end={2008} // default is current year
                  reverse // default is ASCENDING
                  required={true} // default is false
                  value={userInfo.year} // mandatory
                  onChange={(year: string) => {
                    setUserInfo({ ...userInfo, year: Number(year) });
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
                  year={userInfo.year} // mandatory
                  required={true} // default is false
                  value={userInfo.month} // mandatory
                  onChange={(month: string) => {
                    setUserInfo({ ...userInfo, month: Number(month) });
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
                  year={userInfo.year} // mandatory
                  month={userInfo.month} // mandatory
                  endYearGiven // mandatory if end={} is given in YearPicker
                  required={true} // default is false
                  value={userInfo.day} // mandatory
                  onChange={(day: string) => {
                    setUserInfo({ ...userInfo, day: Number(day) });
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
            </BirthdateWrapper>
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
        <Button height="100%" width="100%" borderRadius="0" disabled={!isValidName}>
          수정하기
        </Button>
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
    top: 35%;
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

const EmailInput = styled.div`
  position: relative;
  display: flex;

  svg {
    position: absolute;
    right: 5%;
    top: 32%;
  }
`;

const PhoneValidCheck = styled.div`
  position: relative;
  margin: 4px 0;
  > svg {
    position: absolute;
    right: 35%;
    top: -60%;
    z-index: 10;
  }
`;

export default ProfilePage;
