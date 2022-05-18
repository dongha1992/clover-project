import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B, TextB3R } from '@components/Shared/Text';
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
import { getFormatTime } from '@utils/destination';
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
    value: 'NONE',
  },
];

interface IBirthdayObj {
  year: number;
  month: number;
  day: number;
}

const AGES = 14;

const today = new Date();
const curYear = today.getFullYear();
const curMonth = today.getMonth() + 1;
const curDate = today.getDate();

const vaildYear = curYear - AGES;

const SignupOptionalPage = () => {
  const [checkGender, setChcekGender] = useState<string | null>('');
  const [birthDayObj, setBirthdayObj] = useState<IBirthdayObj>({
    year: 0,
    month: -1,
    day: 0,
  });
  const [isValidBirthDay, setIsValidBirthDay] = useState<boolean>(true);

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

        if (window.Kakao) {
          window.Kakao.cleanup();
        }
      },
    }
  );

  const checkGenderHandler = (value: string | null) => {
    setChcekGender(value);
  };

  const nicknameInputHandler = () => {};

  const registerUser = async () => {
    const nickName = nicknameRef.current?.value;
    const gender = GENDER.find((item) => item.value === checkGender)?.value;

    /* TODO: 회원가입 후 데이터 처리 래퍼 만들어야 함*/
    const hasBirthDate = birthDayObj.year && birthDayObj.month && birthDayObj.day;
    const birthDate = `${birthDayObj.year}-${getFormatTime(birthDayObj.month + 1)}-${getFormatTime(birthDayObj.day)}`;

    const optionalForm = {
      birthDate: hasBirthDate ? birthDate : '',
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

  // useEffect(() => {
  //   // 마지막 페이지에서 새로고침 시 처음으로
  //   if (!signupUser.email) {
  //     router.replace('/signup');
  //   }
  // }, [signupUser]);

  useEffect(() => {
    if (birthDayObj.year === vaildYear) {
      const canRegister =
        birthDayObj.month >= 0 && birthDayObj.month + 1 <= curMonth && birthDayObj.day > 0 && birthDayObj.day < curDate;
      if (!canRegister) {
        setIsValidBirthDay(false);
      } else {
        setIsValidBirthDay(true);
      }
    } else {
      setIsValidBirthDay(true);
    }
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
            <InputContainer>
              <YearPicker
                defaultValue="YYYY"
                start={1922} // default is 1900
                end={vaildYear} // default is current year
                reverse // default is ASCENDING
                required={true} // default is false
                value={birthDayObj.year} // mandatory
                onChange={(year: string) => {
                  setBirthdayObj({ ...birthDayObj, year: Number(year) });
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
                  setBirthdayObj({ ...birthDayObj, month: Number(month) });
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
                  setBirthdayObj({ ...birthDayObj, day: Number(day) });
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
          <TextB3R color={theme.systemRed}>
            {birthDayObj.year && birthDayObj.month && birthDayObj.day && !isValidBirthDay
              ? '14세 미만은 가입할 수 없어요.'
              : null}
          </TextB3R>
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
  }

  .yearContainer {
    display: flex;
    .yearOption[value=''][disabled] {
      display: none;
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

export default SignupOptionalPage;
