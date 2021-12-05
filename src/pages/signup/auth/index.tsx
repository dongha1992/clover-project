import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Text';
import { homePadding, fixedBottom } from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import debounce from 'lodash-es/debounce';
import { Api } from '@api/index';
import router from 'next/router';

function signupAuth() {
  const nameRef = useRef(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const nameInputHandler = (): void => {};

  const phoneNumberHandler = (): void => {
    const tel = phoneNumberRef.current?.value.toString();
  };

  const getAuthTel = async () => {
    if (nameRef.current) {
      const tel = phoneNumberRef.current?.value.toString() as string;
      const result = await Api.addAuthTel({ tel });
    }
  };

  const goToEmailAndPassword = () => {
    router.push('/signup/email-password');
  };

  return (
    <Container>
      <Wrapper>
        <TextWrap>
          <TextH2B>본인확인을 위해</TextH2B>
          <TextH2B>인증을 진행해 주세요.</TextH2B>
        </TextWrap>
        <NameInputWrapper>
          <TextH5B padding="0 0 9px 0">이름</TextH5B>
          <TextInput
            placeholder="이름"
            ref={nameRef}
            eventHandler={debounce(nameInputHandler, 300)}
          />
        </NameInputWrapper>
        <PhoneNumberInputWrapper>
          <TextH5B padding="0 0 9px 0">휴대폰 번호</TextH5B>
          <AuthenficationWrapper>
            <TextInput
              placeholder="휴대폰 번호"
              ref={phoneNumberRef}
              eventHandler={debounce(phoneNumberHandler, 300)}
            />
            <Button
              width="30%"
              margin="0 0 0 8px"
              height="48px"
              onClick={getAuthTel}
            >
              인증 요청
            </Button>
          </AuthenficationWrapper>
          <ConfirmWrapper>
            <TextInput placeholder="인증 번호 입력" />
            <Button width="30%" margin="0 0 0 8px" height="48px" disabled>
              확인
            </Button>
          </ConfirmWrapper>
        </PhoneNumberInputWrapper>
      </Wrapper>
      <NextBtnWrapper onClick={goToEmailAndPassword}>
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

const PhoneNumberInputWrapper = styled.div`
  margin-top: 24px;
`;

const AuthenficationWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;
const ConfirmWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

export default signupAuth;
