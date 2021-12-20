import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B } from '@components/Shared/Text';
import {
  homePadding,
  fixedBottom,
  FlexCol,
  FlexRow,
  theme,
} from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import Button from '@components/Shared/Button';
import debounce from 'lodash-es/debounce';
import router from 'next/router';
// import { Select, Option } from '@components/Dropdown/index';
import { RadioButton } from '@components/Shared/Button/RadioButton';
import { useDispatch, useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER, SET_USER_AUTH } from '@store/user';
import { ISignupUser } from '@model/index';
import { signup } from '@api/user';

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

function SignupOptionalPage() {
  const [checkGender, setChcekGender] = useState<number>(1);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { signupUser } = useSelector(userForm);

  const birthDateInputHandler = (): void => {
    const birthDate = birthDateRef.current?.value.toString();
  };

  const checkGenderHandler = (id: number) => {
    setChcekGender(id);
  };

  const nicknameInputHandler = () => {};

  const goToOptionalInfo = async () => {
    const nickname = nicknameRef.current?.value;
    const birthDate = birthDateRef.current?.value;
    const gender = GENDER.find((item) => item.id === checkGender)?.value;

    /* TODO: 떵크로 회원가입 로직 수정 */
    /* TODO: 회원가입 후 데이터 처리 래퍼 만들어야 함*/

    const optionalForm = {
      birthDate,
      gender,
      nickname: nickname ? nickname : signupUser.name,
    };

    dispatch(
      SET_SIGNUP_USER({
        ...optionalForm,
      })
    );
    try {
      const { data } = await signup({
        ...signupUser,
        ...optionalForm,
      } as ISignupUser);

      if (data.code === 200) {
        const userTokenObj = data.data;
        dispatch(SET_USER_AUTH(userTokenObj));
      }
    } catch (error) {
      console.error(error);
    }

    // router.push('/signup/finish');
  };

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
            <TextH5B
              color={theme.greyScale45}
              textDecoration="underline"
              padding="0 0 0 4px"
            >
              (선택)
            </TextH5B>
          </FlexRow>
          <TextInput
            placeholder="생년월일 구현해야함"
            eventHandler={birthDateInputHandler}
            ref={birthDateRef}
          />
        </FlexCol>
        <FlexCol margin="24px 0 28px 0">
          <FlexRow>
            <TextH5B>성별</TextH5B>
            <TextH5B
              color={theme.greyScale45}
              textDecoration="underline"
              padding="0 0 0 4px"
            >
              (선택)
            </TextH5B>
          </FlexRow>
          <FlexRow padding="17px 0 0 0">
            {GENDER.map((item, index) => {
              return (
                <FlexRow padding="0 16px 0 0" key={index}>
                  <RadioButton
                    onChange={() => checkGenderHandler(item.id)}
                    isSelected={checkGender === item.id}
                  />
                  <TextB2R padding="0 0 0 8px">{item.text}</TextB2R>
                </FlexRow>
              );
            })}
          </FlexRow>
        </FlexCol>
        <FlexCol>
          <FlexRow padding="0 0 9px 0">
            <TextH5B>닉네임</TextH5B>
            <TextH5B
              color={theme.greyScale45}
              textDecoration="underline"
              padding="0 0 0 4px"
            >
              (선택)
            </TextH5B>
          </FlexRow>
          <TextInput
            placeholder="닉네임 (미입력시 이름이 자동 입력됩니다)"
            eventHandler={nicknameInputHandler}
          />
        </FlexCol>
      </Wrapper>
      <NextBtnWrapper onClick={goToOptionalInfo}>
        <Button height="100%" borderRadius="0">
          가입하기
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

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

export default SignupOptionalPage;
