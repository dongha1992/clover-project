import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Text';
import { homePadding, fixedBottom, FlexCol } from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import debounce from 'lodash-es/debounce';
import router from 'next/router';

function emailAndPassword() {
  const emailRef = useRef(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const emailInputHandler = (): void => {};

  const passwordHandler = (): void => {
    const tel = passwordRef.current?.value.toString();
  };

  const goToOptionalInfo = () => {
    router.push('/signup/optional');
  };

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>이메일과 비밀번호를</TextH2B>
          <TextH2B>입력해주세요</TextH2B>
        </TextWrap>
        <NameInputWrapper>
          <TextH5B padding="0 0 9px 0">이메일</TextH5B>
          <TextInput
            placeholder="이메일"
            ref={emailRef}
            eventHandler={debounce(emailInputHandler, 300)}
          />
        </NameInputWrapper>
        <PasswordInputWrapper>
          <TextH5B padding="0 0 9px 0">비밀번호</TextH5B>
          <FlexCol>
            <TextInput
              placeholder="비밀번호"
              ref={passwordRef}
              eventHandler={debounce(passwordHandler, 300)}
            />
            <TextInput
              placeholder="비밀번호 확인"
              ref={passwordRef}
              eventHandler={debounce(passwordHandler, 300)}
              margin="8px 0 0 0"
            />
          </FlexCol>
        </PasswordInputWrapper>
      </Wrapper>
      <NextBtnWrapper onClick={goToOptionalInfo}>
        <Button>다음</Button>
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

const NameInputWrapper = styled.div``;

const PasswordInputWrapper = styled.div`
  margin-top: 24px;
`;

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

export default emailAndPassword;
