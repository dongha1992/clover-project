import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { FlexCenter, FlexCol, FlexRow, homePadding, theme } from '@styles/theme';
import { TextB2R } from '@components/Shared/Text';
import Checkbox from '@components/Shared/Checkbox';
import { Button } from '@components/Shared/Button';
import router, { useRouter } from 'next/router';
import Validation from '@components/Pages/User/Validation';
import { useSelector, useDispatch } from 'react-redux';
import { userForm, SET_USER_AUTH, SET_LOGIN_SUCCESS, SET_TEMP_PASSWORD, SET_USER } from '@store/user';
import { userProfile } from '@api/user';
import { userLoginApi } from '@api/authentication';
import { EMAIL_REGX, PASSWORD_REGX } from '@pages/signup/email-password';
import { SET_LOGIN_TYPE } from '@store/common';
import { cartForm } from '@store/cart';
import { setCookie } from '@utils/common';
import { NAME_REGX } from '@constants/regex';

const LoginPage = () => {
  const [checkAutoLogin, setCheckAutoLogin] = useState(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [returnPath, setReturnPath] = useState<string | string[]>('/');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);

  const dispatch = useDispatch();
  const onRouter = useRouter();

  useEffect(() => {
    setReturnPath(onRouter.query.returnPath || '/');
  }, []);

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
    if (!isValid) return;
    dispatch(SET_LOGIN_SUCCESS(false));

    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value.toString();

      try {
        const { data } = await userLoginApi({
          email,
          password,
          loginType: 'EMAIL',
        });

        if (data.code === 200) {
          const isDormantAccount = false;
          const userTokenObj = data.data;
          if (userTokenObj?.tmpPasswordUsed) {
            dispatch(SET_USER_AUTH(userTokenObj));
            dispatch(SET_TEMP_PASSWORD(password));
            router.push('/mypage/profile/password');
            return;
          }
          dispatch(SET_USER_AUTH(userTokenObj));
          dispatch(SET_LOGIN_SUCCESS(true));
          dispatch(SET_LOGIN_TYPE('EMAIL'));

          const userInfo = await userProfile().then((res) => {
            return res?.data;
          });

          setCookie({
            name: 'autoL',
            value: checkAutoLogin ? 'Y' : 'N',
            option: {
              path: '/',
              maxAge: userTokenObj?.refreshTokenExpiresIn,
            },
          });

          dispatch(SET_USER(userInfo.data));

          if (isDormantAccount) {
            router.push('/mypage/profile/dormant');
          } else {
            router.push(`${returnPath}`);
          }
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('이메일 혹은 비밀번호를 다시 입력해 주세요.');
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      finishLogin();
    }
  };

  // TODO : finish 이후에 넣는게 맞는거같음

  // useEffect(() => {
  //   if (isLoginSuccess) {
  //     const isDormantAccount = false;
  //     if (isDormantAccount) {
  //       router.push('/mypage/profile/dormant');
  //     } else {
  //       router.push(`${returnPath}`);
  //     }
  //   }
  //   return () => {};
  // }, [isLoginSuccess]);

  return (
    <Container>
      <FlexCol padding="32px 0 0 0">
        <TextInput margin="0 0 8px 0" placeholder="이메일" ref={emailRef} keyPressHandler={handleKeyPress} />
        <TextInput
          placeholder="비밀번호"
          inputType="password"
          ref={passwordRef}
          eventHandler={passwordInputHandler}
          keyPressHandler={handleKeyPress}
        />
        {errorMessage && <Validation>{errorMessage}</Validation>}
      </FlexCol>
      <FlexRow padding="16px 0 24px 0">
        <Checkbox onChange={checkAutoLoginHandler} isSelected={checkAutoLogin} />
        <TextB2R padding="2px 0 0 8px">자동 로그인</TextB2R>
      </FlexRow>
      <BtnWrapper onClick={finishLogin}>
        <Button disabled={!isValid}>로그인하기</Button>
      </BtnWrapper>
      <FlexCenter>
        <TextB2R color={theme.greyScale75} onClick={goToFindEmail} pointer>
          아이디(이메일) 찾기
        </TextB2R>
        <Col />
        <TextB2R color={theme.greyScale75} onClick={goToFindPassword} pointer>
          비밀번호 찾기
        </TextB2R>
      </FlexCenter>
      <SignupBtnWrapper>
        <Button onClick={goToSignup} backgroundColor={theme.white} border color={theme.black}>
          회원가입하고 신규 혜택 받기
        </Button>
      </SignupBtnWrapper>
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

const SignupBtnWrapper = styled.div`
  padding-top: 48px;
`;

export default LoginPage;
