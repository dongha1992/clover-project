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

const GENDER = [
  {
    id: 1,
    text: '여성',
  },
  {
    id: 2,
    text: '남성',
  },
  {
    id: 3,
    text: '선택 안 함',
  },
];

function emailAndPassword() {
  const [checkGender, setChcekGender] = useState<number>(1);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const nicknameInputHandler = (): void => {
    const tel = nicknameRef.current?.value.toString();
  };

  const checkGenderHandler = (id: number) => {
    setChcekGender(id);
  };

  const goToOptionalInfo = () => {
    router.push('/signup/finish');
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
          <TextInput placeholder="생년월일 구현해야함" />
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

export default emailAndPassword;
