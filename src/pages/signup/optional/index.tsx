import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B, TextB3R } from '@components/Shared/Text';
import { homePadding, fixedBottom, FlexCol, FlexRow, theme, customInput, textBody2 } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import router from 'next/router';
import { Button, RadioButton } from '@components/Shared/Button';
import { useDispatch, useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER, SET_USER_AUTH, SET_LOGIN_SUCCESS, INIT_SIGNUP_USER, SET_USER } from '@store/user';
import { SET_LOGIN_TYPE } from '@store/common';
import { ISignupUser, ILogin } from '@model/index';
import { userSignup, userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { useMutation } from 'react-query';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
import { getFormatTime } from '@utils/destination';
import BirthDate from '@components/BirthDate';
import { SVGIcon } from '@utils/common';
import Validation from '@components/Pages/User/Validation';
import { NAME_REGX } from '@constants/regex';
import { getValidBirthday } from '@utils/common';
import { SET_ALERT } from '@store/alert';

export const GENDER = [
  {
    id: 1,
    text: '여성',
    value: 'FEMALE',
  },
  {
    id: 2,
    text: '남성',
    value: 'MALE',
  },
  {
    id: 3,
    text: '선택 안 함',
    value: 'NONE',
  },
];

export interface IBirthdayObj {
  year: number;
  month: number;
  day: number;
}

const SignupOptionalPage = () => {
  const [checkGender, setChcekGender] = useState<string | null>('NONE');
  const [birthDayObj, setBirthdayObj] = useState<IBirthdayObj>({
    year: 0,
    month: 0,
    day: 0,
  });
  const [isValidBirthDay, setIsValidBirthDay] = useState<boolean>(true);
  const [nickname, setNickname] = useState('');
  const [nameValidation, setNameValidation] = useState(false);

  const dispatch = useDispatch();
  const { signupUser } = useSelector(userForm);
  const recommendCode = sessionStorage.getItem('recommendCode');

  const { mutateAsync: mutateRegisterUser } = useMutation(
    async (reqBody: ISignupUser) => {
      const { data } = await userSignup(reqBody);
      return { data: data.data, reqBody };
    },
    {
      onSuccess: async ({ data, reqBody }) => {
        const userTokenObj = data;
        dispatch(SET_USER_AUTH(userTokenObj));
        dispatch(SET_LOGIN_SUCCESS(true));
        dispatch(INIT_SIGNUP_USER());
        await signupAfterLoign(reqBody);

        if (window.Kakao) {
          window.Kakao.cleanup();
        }
      },
      onError: (error: any) => {
        const message = error?.message.split(',')[1].split(':')[1];
        dispatch(SET_ALERT({ alertMessage: message ?? error.message }));
      },
    }
  );

  const signupAfterLoign = async (reqBody: ISignupUser) => {
    let type = '';
    let body = {} as ILogin;

    if (signupUser.loginType === 'EMAIL') {
      type = 'EMAIL';
      body = { email: reqBody.email, password: reqBody.password, loginType: 'EMAIL' };
    } else if (signupUser.loginType === 'APPLE') {
      type = 'APPLE';
      body = { accessToken: `${reqBody.appleToken}`, loginType: 'APPLE' };
    }

    const { data } = await userLoginApi(body);

    try {
      if (data.code === 200) {
        dispatch(SET_LOGIN_TYPE(type));
        const userInfo = await userProfile().then((res) => {
          return res?.data;
        });
        dispatch(SET_USER(userInfo.data));
        setTimeout(() => {
          dispatch(
            SET_BOTTOM_SHEET({
              content: <WelcomeSheet recommendCode={recommendCode as string} />,
            })
          );
        }, 100);
        localStorage.removeItem('appleToken');
      }
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
    }
  };

  const checkGenderHandler = (value: string | null) => {
    setChcekGender(value);
  };

  const changeBirthDateHandler = (e: any) => {
    const { name, value } = e.target;
    setBirthdayObj({ ...birthDayObj, [name]: Number(value) });
  };

  const nicknameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const lengthCheck = value.length < 2 || value.length > 20;

    if (!NAME_REGX.test(value) || lengthCheck) {
      setNameValidation(false);
    } else {
      setNameValidation(true);
    }
    setNickname(value);
  };

  const registerUser = async () => {
    if (!isValidBirthDay) return;

    const gender = GENDER.find((item) => item.value === checkGender)?.value;
    const hasBirthDate = birthDayObj.year > 0 && birthDayObj.month > 0 && birthDayObj.day > 0;
    const birthDate = `${birthDayObj.year}-${getFormatTime(birthDayObj.month)}-${getFormatTime(birthDayObj.day)}`;

    const optionalForm = {
      birthDate: hasBirthDate ? birthDate : '',
      gender: gender ? gender : '',
      nickname: nickname ? nickname : signupUser.name,
    };

    let appleToken = null;

    if (signupUser.loginType === 'APPLE') {
      appleToken = localStorage.getItem('appleToken');
    }

    dispatch(
      SET_SIGNUP_USER({
        ...optionalForm,
        appleToken,
      })
    );
    mutateRegisterUser({ ...signupUser, ...optionalForm, appleToken } as ISignupUser);
  };

  useEffect(() => {
    // 마지막 페이지에서 새로고침 시 처음으로
    if (!signupUser.email) {
      router.replace('/signup');
    }
  }, []);

  useEffect(() => {
    setIsValidBirthDay(getValidBirthday(birthDayObj));
  }, [birthDayObj]);

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>마지막으로</TextH2B>
          <TextH2B>더 알고 싶어요</TextH2B>
        </TextWrap>
        <FlexCol>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>생년월일</TextH5B>
            <TextH5B color={theme.greyScale45} textDecoration="underline" padding="0 0 0 4px">
              (선택)
            </TextH5B>
          </FlexRow>
          <BirthdateWrapper>
            <BirthDate onChange={changeBirthDateHandler} selected={birthDayObj} />
          </BirthdateWrapper>
          <Validation>
            {birthDayObj.year && birthDayObj.month && birthDayObj.day && !isValidBirthDay
              ? '14세 미만은 가입할 수 없어요.'
              : null}
          </Validation>
        </FlexCol>

        <FlexCol margin="24px 0 28px 0">
          <FlexRow>
            <TextH5B>성별</TextH5B>
            <TextH5B color={theme.greyScale45} textDecoration="underline" padding="0 0 0 4px">
              (선택)
            </TextH5B>
          </FlexRow>
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
        <FlexCol>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>닉네임</TextH5B>
            <TextH5B color={theme.greyScale45} textDecoration="underline" padding="0 0 0 4px">
              (선택)
            </TextH5B>
          </FlexRow>
          <TextInput placeholder="닉네임 (미입력시 이름이 자동 입력됩니다)" eventHandler={nicknameInputHandler} />
        </FlexCol>
        {nickname.length > 0 && !nameValidation && <Validation>2~20자 이내 / 한글, 영문만 입력 가능해요.</Validation>}
      </Wrapper>
      <NextBtnWrapper onClick={registerUser}>
        <Button height="100%" borderRadius="0">
          가입하기
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

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

const BirthdateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const YearInput = styled.div`
  width: 30%;
`;

export default SignupOptionalPage;
