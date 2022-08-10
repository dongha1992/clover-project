import React, { useState, useEffect, useRef, useCallback } from 'react';
import { homePadding, fixedBottom, FlexBetween, theme, FlexCol, FlexRow, customInput, textBody2 } from '@styles/theme';
import styled from 'styled-components';
import { TextH4B, TextH5B, TextH6B, TextB2R, TextB3R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import BorderLine from '@components/Shared/BorderLine';
import { GENDER } from '@pages/signup/optional';
import { Button, RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { SVGIcon } from '@utils/common';
import { useInterval } from '@hooks/useInterval';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { PHONE_REGX } from '@pages/signup/auth';
import { userAuthTel, userConfirmTel } from '@api/user';
import { userForm, INIT_USER, SET_USER } from '@store/user';
import { availabilityEmail, userChangeInfo, userProfile } from '@api/user';
import Validation from '@components/Pages/User/Validation';
import { EMAIL_REGX } from '@pages/signup/email-password';
import { getFormatTime } from '@utils/destination';
import BirthDate from '@components/BirthDate';
import { NAME_REGX } from '@constants/regex';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { IChangeMe } from '@model/index';
import { getValidBirthday } from '@utils/common';

interface IVaildation {
  message: string;
  isValid: boolean;
}

interface IUserInfo {
  nickname: string;
  name: string;
  email: string;
  tel: string;
  year: number;
  month: number;
  day: number;
}

const LIMIT = 240;
const FIVE_MINUTE = 300;

const ProfilePage = () => {
  // const { me } = useSelector(userForm);

  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [oneMinuteDisabled, setOneMinuteDisabled] = useState(false);
  const [delay, setDelay] = useState<number | null>(null);

  const [emailValidation, setEmailValidataion] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [checkGender, setChcekGender] = useState<string>('NONE');
  const [isAuthTel, setIsAuthTel] = useState(false);
  const [authCodeValidation, setAuthCodeValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    nickname: '',
    name: '',
    email: '',
    tel: '',
    year: 0,
    month: -1,
    day: 0,
  });

  const [isValidBirthDay, setIsValidBirthDay] = useState<boolean>(true);
  const [authCodeConfirm, setAuthCodeConfirm] = useState<boolean>(false);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);
  const [isValidNickname, setIsValidNickname] = useState(true);
  const authCodeNumberRef = useRef<HTMLInputElement>(null);

  let authTimerRef = useRef(300);
  // let authTimerRef = useRef(5);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: me, isLoading: infoLoading } = useQuery(
    'getUserProfile',
    async () => {
      const { data } = await userProfile();

      if (data.code === 200) {
        return data.data;
      }
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        dispatch(SET_USER(data));
      },
      onError: () => {
        router.replace('/onboarding');
      },
    }
  );

  const { mutateAsync: mutationEditProfile } = useMutation(
    async (reqBody: IChangeMe) => {
      const { data } = await userChangeInfo(reqBody);
      return data;
    }, // query: { menuId: router.query.menuId },
    {
      onSuccess: async () => {
        dispatch(
          SET_ALERT({
            alertMessage: '수정을 성공하였습니다.',
            onSubmit: () => {
              if (router.query.returnPath) {
                const editReturnPath = `${router.query.returnPath}?isReopen=true`;
                router.push(editReturnPath as string);
              } else {
                router.push('/mypage');
              }
            },
          })
        );
        await queryClient.refetchQueries('getUserProfile');
      },
      onError: async (error: any) => {
        console.error(error);
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
    }
  );

  useEffect(() => {
    if (authTimerRef.current < 0) {
      setDelay(null);
      setIsOverTime(true);
    }
    // 1분 지나면 인증 요청 다시 활성
    if (authTimerRef.current < LIMIT) {
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
        resetTimer();
        setOneMinuteDisabled(true);
        setDelay(1000);
        if (isOverTime) {
          setIsOverTime(false);
          resetTimer();
        }
      }
    } catch (error: any) {
      if (error.code === 2000) {
        dispatch(
          SET_ALERT({
            alertMessage: `이미 사용 중인 휴대폰 번호예요. 입력한 번호를 확인해 주세요.`,
          })
        );
      } else if (error.code === 2007) {
        dispatch(
          SET_ALERT({
            alertMessage: '이미 사용 중인 휴대폰 번호예요. 입력한 번호를 확인해 주세요.',
          })
        );
      } else if (error.code === 2010) {
        dispatch(
          SET_ALERT({
            alertMessage: '탈퇴한 번호입니다. 탈퇴한 날부터 30일 이후 재가입 가능해요.',
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
          if (error.code === 2002 || error.code === 1103) {
            dispatch(
              SET_ALERT({
                alertMessage:
                  '인증번호가 올바르지 않습니다. \n 5회 이상 실패 시 해당 번호로 인증 요청이 24시간 제한됩니다.',
                submitBtnText: '확인',
              })
            );
          } else if (error.code === 2013) {
            dispatch(
              SET_ALERT({ alertMessage: '24시간 동안 해당 번호로 인증 요청이 불가합니다.', submitBtnText: '확인' })
            );
          } else {
            dispatch(SET_ALERT({ alertMessage: error.message, submitBtnText: '확인' }));
          }
          console.error(error);
        }
      }
    }
  };

  const checkGenderHandler = (value: string) => {
    setChcekGender(value);
  };

  const resetTimer = () => {
    authTimerRef.current = FIVE_MINUTE;
    // authTimerRef.current = 5;
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

  const onChangeUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      const isBirthDate = ['year', 'month', 'day'].includes(name);

      // if (name === 'name') {
      //   checkNameValid(value);
      // } else if (name === 'nickname') {
      //   checkNickNameValid(value);
      // }
      setUserInfo({ ...userInfo, [name]: isBirthDate ? Number(value) : value });
    },
    [userInfo]
  );

  const getDeleteUser = async () => {
    // TODO : 정기배송, 주문, 후불결제 등 서비스이용이 남은 경우 탈퇴불가처리 해야됨
    router.push('/mypage/profile/secession');
  };

  const goToChangePassword = () => {
    router.push('/mypage/profile/password');
  };

  const changeMeInfo = async () => {
    if (!isValidName || !isValidNickname) return;
    if (!isValidBirthDay) {
      dispatch(SET_ALERT({ alertMessage: '14세 미만은 가입할 수 없어요.' }));
      return;
    }
    const hasBirthDate = userInfo.year > 0 && userInfo.month > 0 && userInfo.day > 0;
    const birthDate = `${userInfo.year}-${getFormatTime(userInfo.month)}-${getFormatTime(userInfo.day)}`;

    const reqBody = {
      authCode: authCodeNumberRef?.current?.value ? authCodeNumberRef?.current?.value : null,
      birthDate: hasBirthDate ? birthDate : null,
      gender: checkGender,
      email: userInfo.email,
      marketingEmailReceived: me?.marketingEmailReceived!,
      marketingPushReceived: me?.marketingPushReceived!,
      marketingSmsReceived: me?.marketingSmsReceived!,
      name: userInfo.name,
      nickname: userInfo.nickname,
      notiPushReceived: me?.notiPushReceived!,
      primePushReceived: me?.primePushReceived!,
      tel: userInfo.tel,
    };
    mutationEditProfile(reqBody);
  };

  const checkNameValid = (value: string) => {
    const lengthCheck = value.length < 2 || value.length > 20;
    if (!NAME_REGX.test(value) || lengthCheck) {
      setIsValidName(false);
    } else {
      setIsValidName(true);
    }
  };

  const checkNickNameValid = (value: string) => {
    const lengthCheck = value.length < 2 || value.length > 20;
    if (!NAME_REGX.test(value) || lengthCheck) {
      setIsValidNickname(false);
    } else {
      setIsValidNickname(true);
    }
  };

  const checkPhoneValid = () => {
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
      nickname: me?.nickname ? me?.nickname : me?.name!,
      name: me?.name!,
      email: me?.email!,
      tel: me?.tel!,
      year: hasBirthDate ? Number(year) : 0,
      month: hasBirthDate ? Number(month) : 0,
      day: hasBirthDate ? Number(day) : 0,
    });
    checkPhoneValid();
  }, [me]);

  useEffect(() => {
    const birthObj = { year: userInfo.year, month: userInfo.month, day: userInfo.day };
    setIsValidBirthDay(getValidBirthday(birthObj));
  }, [userInfo.day, userInfo.month, userInfo.year]);

  useEffect(() => {
    checkNickNameValid(userInfo.nickname);
  }, [userInfo.nickname]);

  const isKakao = me?.joinType === 'KAKAO';
  const isNotEmail = me?.joinType !== 'EMAIL';

  console.log(isValidNickname, 'isValidNickname');

  return (
    <Container>
      <Wrapper>
        <LoginInfoWrapper>
          <FlexBetween padding="24px 0 ">
            <TextH4B>로그인 정보</TextH4B>
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
              <>{!isNotEmail && <SVGIcon name="confirmCheck" />}</>
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
            <TextInput name="name" value={userInfo.name || ''} eventHandler={onChangeUserInfo} />
            {!isValidName && (
              <TextB3R color={theme.systemRed}>최소 2자 최대 20자 이내, 한글/영문만 입력 가능해요.</TextB3R>
            )}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">닉네임</TextH5B>
            <TextInput name="nickname" value={userInfo.nickname || ''} eventHandler={onChangeUserInfo} />
            {!isValidNickname && (
              <TextB3R color={theme.systemRed}>최소 2자 최대 20자 이내, 한글/영문만 입력 가능해요.</TextB3R>
            )}
          </FlexCol>
          <FlexCol padding="0 0 24px 0">
            <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
            <FlexRow>
              <TextInput
                placeholder="휴대폰 번호 (-제외)"
                inputType="number"
                eventHandler={phoneNumberInputHandler}
                value={userInfo.tel || ''}
                disabled={!isAuthTel}
                keyPressHandler={telKeyPressHandler}
              />
              {isAuthTel ? (
                <Button width="40%" margin="0 0 0 8px" onClick={getAuthTel}>
                  {delay ? '재요청' : '인증요청'}
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
              <BirthDate
                onChange={onChangeUserInfo}
                selected={{ year: userInfo.year, month: userInfo.month, day: userInfo.day }}
              />
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
        <Button height="100%" width="100%" borderRadius="0" disabled={!isValidName || !isValidNickname}>
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
