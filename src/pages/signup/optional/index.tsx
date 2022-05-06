import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B } from '@components/Shared/Text';
import { homePadding, fixedBottom, FlexCol, FlexRow, theme, customInput, textBody2 } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import router from 'next/router';
import { Button, RadioButton } from '@components/Shared/Button';
import { useDispatch, useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER, SET_USER_AUTH, SET_LOGIN_SUCCESS } from '@store/user';
import { ISignupUser } from '@model/index';
import { userSignup } from '@api/user';
import { useMutation } from 'react-query';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import { SVGIcon } from '@utils/common';

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
    value: '',
  },
];

interface IBirthdayObj {
  year: number;
  month: number;
  day: number;
}

const SignupOptionalPage = () => {
  const [checkGender, setChcekGender] = useState<string>('');
  const [birthDayObj, setBirdayObj] = useState<IBirthdayObj>({
    year: 'YYYY',
    month: 'MM',
    day: 'DD',
  });
  const nicknameRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { signupUser } = useSelector(userForm);

  const { mutateAsync: mutateRegisterUser } = useMutation(
    async (reqBody: ISignupUser) => {
      return userSignup(reqBody);
    },
    {
      onSuccess: ({ data }) => {
        const userTokenObj = data.data;
        dispatch(SET_USER_AUTH(userTokenObj));
        dispatch(SET_LOGIN_SUCCESS(true));
      },
    }
  );

  const checkGenderHandler = (value: string) => {
    setChcekGender(value);
  };

  const nicknameInputHandler = () => {};

  const registerUser = async () => {
    const nickName = nicknameRef.current?.value;
    const gender = GENDER.find((item) => item.value === checkGender)?.value;

    /* TODO: 회원가입 후 데이터 처리 래퍼 만들어야 함*/

    const birthDate = `${birthDayObj.year}-${birthDayObj.month}-${birthDayObj.day}`;
    const optionalForm = {
      birthDate,
      gender: gender ? gender : '',
      nickName: nickName ? nickName : signupUser.name,
    };

    dispatch(
      SET_SIGNUP_USER({
        ...optionalForm,
      })
    );
    try {
      let { data } = await mutateRegisterUser({ ...signupUser, ...optionalForm } as ISignupUser);
      data.code === 200;
      if (data.code === 200) {
        dispatch(SET_BOTTOM_SHEET({ content: <WelcomeSheet /> }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // 마지막 페이지에서 새로고침 시 처음으로
    if (!signupUser.email) {
      router.replace('/signup');
    }
  }, [signupUser]);

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
            <InputContainer>
              <YearPicker
                defaultValue="YYYY"
                start={1920} // default is 1900
                end={2022} // default is current year
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
          </BirthdateWrapper>
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
const Month = styled.div`
  position: relative;
  margin-right: 10px;
  width: 100%;
`;
const Day = styled.div``;

export default SignupOptionalPage;
