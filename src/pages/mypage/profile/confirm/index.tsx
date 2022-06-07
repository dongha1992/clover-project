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
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { userForm } from '@store/user';

const PasswordConfirmPage = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { me } = useSelector(userForm);

  const passwordInputHandler = () => {
    if (passwordRef.current) {
      const password = passwordRef.current?.value.toString();

      const passwordVaildCheck = password.length > 7 && password.length < 20;

      if (passwordVaildCheck) {
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
        if (data.code === 200) {
          router.push('/mypage/profile');
        }
      } catch (error: any) {
        console.error(error);
        if (error.code === 2109) {
          dispatch(SET_ALERT({ alertMessage: '비밀번호가 일치하지 않습니다.' }));
        }
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      getConfirmPassword();
    }
  };

  return (
    <Container>
      <Wrapper>
        <FlexCol padding="39px 0 32px 0">
          <TextH2B padding="0 0 16px 0">비밀번호 재확인</TextH2B>
          <TextB2R color={theme.greyScale65}>
            회원님의 소중한 정보를 보호하기 위해 비밀번호를 한번 더 입력받고 있어요.
          </TextB2R>
        </FlexCol>
        <FlexCol>
          <FlexCol>
            <TextH5B>이메일</TextH5B>
            <TextInput margin="9px 0 0 0" placeholder="이메일" value={me?.email} disabled={true} />
          </FlexCol>
          <FlexCol padding="24px 0 0 0">
            <TextH5B>비밀번호</TextH5B>
            <TextInput
              placeholder="비밀번호"
              inputType="password"
              ref={passwordRef}
              eventHandler={passwordInputHandler}
              margin="9px 0 0 0"
              keyPressHandler={handleKeyPress}
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
