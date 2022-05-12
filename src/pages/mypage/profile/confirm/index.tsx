import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { TextB2R, TextH2B, TextH5B } from '@components/Shared/Text';
import { homePadding, FlexCol, theme, fixedBottom } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { EMAIL_REGX, PASSWORD_REGX } from '@pages/signup/email-password';
import Validation from '@components/Pages/User/Validation';
import { Button } from '@components/Shared/Button';
import { userConfirmPassword } from '@api/user';
import router from 'next/router';

const PasswordConfirmPage = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const passwordInputHandler = () => {
    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value.toString();

      const emailVaildCheck = EMAIL_REGX.test(email);
      const passwordVaildCheck = password.length > 7 && password.length < 20;

      if (emailVaildCheck && passwordVaildCheck) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  const getConfirmPassword = async () => {
    if (passwordRef.current) {
      const password = passwordRef.current.value.toString();
      try {
        const { data } = await userConfirmPassword({ password });
        console.log(data);
        if (data.code === 200) {
          router.push('/mypage/profile');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <FlexCol padding="39px 0 32px 0">
          <TextH2B padding="0 0 16px 0">비밀번호 재확인</TextH2B>
          <TextB2R color={theme.greyScale65}>
            회원님의 소중한 정보를 보호하기 위해 비밀번호를 다시 한번 입력받고 있습니다.
          </TextB2R>
        </FlexCol>
        <FlexCol>
          <FlexCol>
            <TextH5B>이메일</TextH5B>
            <TextInput margin="9px 0 0 0" placeholder="이메일" ref={emailRef} />
          </FlexCol>
          <FlexCol padding="24px 0 0 0">
            <TextH5B>비밀번호</TextH5B>
            <TextInput
              placeholder="비밀번호"
              inputType="password"
              ref={passwordRef}
              eventHandler={passwordInputHandler}
              margin="9px 0 0 0"
            />
          </FlexCol>
          {errorMessage && <Validation>{errorMessage}</Validation>}
        </FlexCol>
      </Wrapper>
      <BtnWrapper onClick={getConfirmPassword}>
        <Button disabled={!isValid} height="100%" borderRadius="0">
          확인
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div``;
const BtnWrapper = styled.div`
  ${fixedBottom}
`;

export default PasswordConfirmPage;
