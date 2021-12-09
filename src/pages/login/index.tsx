import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/TextInput';
import {
  FlexCenter,
  FlexCol,
  FlexRow,
  homePadding,
  theme,
} from '@styles/theme';
import { TextB2R } from '@components/Text';
import Checkbox from '@components/Checkbox';
import Button from '@components/Button';
import router from 'next/router';
import Validation from '@components/Validation';
import { Api } from '@api/index';
import { useSelector } from 'react-redux';
import { userForm, SET_USER_AUTH, SET_USER_LOGIN_AUTH } from '@store/user';
import { userLogin } from '@api/v2';
import { useDispatch } from 'react-redux';
import wrapper from '@store/index';
// import { setRefreshToken } from '@components/Auth';

function login() {
  const [checkAutoLogin, setCheckAutoLogin] = useState(true);
  const [loginType, setLoginType] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { signupUser, isSuccessLogin } = useSelector(userForm);
  const dispatch = useDispatch();

  useEffect(() => {
    initLocalStorage();
    return () => {};
  }, []);

  const initLocalStorage = () => {
    try {
      const data = localStorage.getItem('loginType');
      return data ? setLoginType(JSON.parse(data)) : '';
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const checkAutoLoginHandler = () => {
    setCheckAutoLogin(!checkAutoLogin);
  };

  const goToSignup = () => {
    router.push('/signup');
  };
  const goToFindEmail = () => {
    router.push('/login/find-account/email');
  };

  const goToFindPassword = () => {
    router.push('/login/find-account/password');
  };

  const finishLogin = async () => {
    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value.toString();

      dispatch(
        SET_USER_LOGIN_AUTH({
          email,
          password,
          loginType: signupUser.loginType ? signupUser.loginType : loginType,
        })
      );

      console.log(isSuccessLogin, 'isSuccessLogin');

      if (isSuccessLogin) {
        const isDormantAccount = false;
        if (isDormantAccount) {
          router.push('/login/dormant');
        } else {
          router.push('/home');
        }
      }
    }
  };

  return (
    <Container>
      <FlexCol padding="32px 0 0 0">
        <TextInput margin="0 0 8px 0" placeholder="이메일" ref={emailRef} />
        <TextInput
          placeholder="비밀번호"
          inputType="password"
          ref={passwordRef}
        />
        <Validation>s</Validation>
      </FlexCol>
      <FlexRow padding="16px 0 24px 0">
        <Checkbox
          onChange={checkAutoLoginHandler}
          isSelected={checkAutoLogin}
        />
        <TextB2R padding="2px 0 0 8px">자동 로그인</TextB2R>
      </FlexRow>
      <BtnWrapper onClick={finishLogin}>
        <Button>로그인하기</Button>
      </BtnWrapper>
      <FlexCenter>
        <TextB2R color={theme.greyScale75} onClick={goToSignup}>
          회원가입
        </TextB2R>
        <Col />
        <TextB2R color={theme.greyScale75} onClick={goToFindEmail}>
          아이디(이메일) 찾기
        </TextB2R>
        <Col />
        <TextB2R color={theme.greyScale75} onClick={goToFindPassword}>
          비밀번호 찾기
        </TextB2R>
      </FlexCenter>
    </Container>
  );
}

const Container = styled.div`
  ${homePadding}
`;

const BtnWrapper = styled.div`
  margin-bottom: 8px;
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 8px;
`;

export const getServerSideProps = wrapper.getServerSideProps(
  (store: any) => async (context: any) => {
    // await setRefreshToken(context, store);
    return {
      props: {},
    };
  }
);

export default login;
