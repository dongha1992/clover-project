import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B } from '@components/Text';
import {
  homePadding,
  fixedBottom,
  FlexCol,
  FlexRow,
  theme,
} from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import debounce from 'lodash-es/debounce';
import router from 'next/router';
// import { Select, Option } from '@components/Dropdown/index';
import { RadioButton } from '@components/Button/RadioButton';
import { useDispatch, useSelector } from 'react-redux';
import { userForm, SET_USER } from '@store/user';
import { Api } from '@api/index';
import { ISignup } from '@model/index';

const GENDER = [
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

function signupOptional() {
  const [checkGender, setChcekGender] = useState<number>(1);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const user = useSelector(userForm);

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
    const optionalForm = {
      birthDate,
      gender,
      nickname: nickname ? nickname : user.name,
    };

    dispatch(
      SET_USER({
        ...optionalForm,
      })
    );

    const data = { ...user, ...optionalForm } as ISignup;
    const res = await Api.addSignup(data);

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
            eventHandler={debounce(nicknameInputHandler, 300)}
          />
        </FlexCol>
      </Wrapper>
      <NextBtnWrapper onClick={goToOptionalInfo}>
        <Button>가입하기</Button>
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

export default signupOptional;
