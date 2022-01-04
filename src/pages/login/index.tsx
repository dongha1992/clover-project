import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import {
  FlexCenter,
  FlexCol,
  FlexRow,
  homePadding,
  theme,
} from '@styles/theme';
import { TextB2R } from '@components/Shared/Text';
import Checkbox from '@components/Shared/Checkbox';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import Validation from '@components/Pages/User/Validation';
import { useSelector, useDispatch } from 'react-redux';
import {
  userForm,
  SET_USER_AUTH,
  SET_LOGIN_SUCCESS,
  SET_TEMP_PASSWORD,
} from '@store/user';
import wrapper from '@store/index';
import { userLogin } from '@api/user';
import { EMAIL_REGX, PASSWORD_REGX } from '@pages/signup/email-password';

const LoginPage = () => {
  const [checkAutoLogin, setCheckAutoLogin] = useState(true);
  const [loginType, setLoginType] = useState('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { isLoginSuccess } = useSelector(userForm);
  const dispatch = useDispatch();

  useEffect(() => {
    initLocalStorage();
    return () => {};
  }, []);

  useEffect(() => {
    if (isLoginSuccess) {
      const isDormantAccount = true;
      if (isDormantAccount) {
        router.push('/mypage/profile/dormant');
      } else {
        router.push('/home');
      }
    }
    return () => {
      dispatch(SET_LOGIN_SUCCESS(false));
    };
  }, [isLoginSuccess]);

  const initLocalStorage = () => {
    try {
      const data = localStorage.getItem('loginType');
      return data ? setLoginType(JSON.parse(data)) : '';
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const passwordInputHandler = () => {
    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value.toString();

      const emailVaildCheck = EMAIL_REGX.test(email);
      const passwordVaildCheck = password.length > 7 && password.length < 20;

      if (emailVaildCheck && passwordVaildCheck) {
        setIsValid(true);
      }
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
    dispatch(SET_LOGIN_SUCCESS(false));

    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value.toString();

      try {
        const { data } = await userLogin({
          email,
          password,
          loginType,
        });

        if (data.code === 200) {
          const userTokenObj = data.data;
          if (userTokenObj?.tmpPasswordUsed) {
            dispatch(SET_TEMP_PASSWORD(password));
            router.push('/mypage/profile/password');
            return;
          }

          dispatch(SET_USER_AUTH(userTokenObj));
          dispatch(SET_LOGIN_SUCCESS(true));
        }
      } catch (error) {
        console.error(error);

        /* TODO: 서버에서 내려오는 message에 따라 wrapper 만들어야 함 */
        setErrorMessage(
          '가입하지 않은 아이디이거나, 로그인 정보를 확인해주세요.'
        );
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
          eventHandler={passwordInputHandler}
        />
        {errorMessage && <Validation>{errorMessage}</Validation>}
      </FlexCol>
      <FlexRow padding="16px 0 24px 0">
        <Checkbox
          onChange={checkAutoLoginHandler}
          isSelected={checkAutoLogin}
        />
        <TextB2R padding="2px 0 0 8px">자동 로그인</TextB2R>
      </FlexRow>
      <BtnWrapper onClick={finishLogin}>
        <Button disabled={!isValid}>로그인하기</Button>
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
};

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

export default LoginPage;
