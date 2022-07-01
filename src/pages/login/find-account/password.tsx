import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextB2R } from '@components/Shared/Text';
import { fixedBottom } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { PHONE_REGX } from '@pages/signup/auth';
import { EMAIL_REGX } from '@pages/signup/email-password';
import Validation from '@components/Pages/User/Validation';
import { userHelpPassword } from '@api/user';
import router from 'next/router';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';

const FindPasswordPage = () => {
  const [phoneValid, setPhoneValid] = useState({
    message: '',
    isValid: false,
  });
  const [emailValid, setEmailValid] = useState({
    message: '',
    isValid: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const emailInputHandler = () => {
    if (emailRef.current) {
      const email = emailRef.current?.value.toString();

      const emailValidCheck = EMAIL_REGX.test(email);

      if (emailValidCheck) {
        setEmailValid({ ...emailValid, isValid: true });
      } else {
        setEmailValid({ ...emailValid, isValid: false });
      }
    }
  };

  const phoneInputHandler = () => {
    if (phoneRef.current) {
      const phone = phoneRef.current?.value.toString();

      const phoneValidCheck = PHONE_REGX.test(phone);

      if (phoneValidCheck) {
        setPhoneValid({ ...phoneValid, isValid: true });
      } else {
        setPhoneValid({ ...phoneValid, isValid: false });
      }
    }
  };

  const getHelpPassword = async () => {
    if (phoneRef.current && emailRef.current) {
      const tel = phoneRef.current?.value.toString();
      const email = emailRef.current?.value;

      try {
        const { data } = await userHelpPassword({ tel, email });
        if (data.code === 200) {
          dispatch(
            SET_ALERT({
              alertMessage: '입력하신 휴대폰 번호로 임시비밀번호를 보냈어요.',
            })
          );
        }
      } catch (error: any) {
        if (error.code === 2008) {
          dispatch(SET_ALERT({ alertMessage: '카카오로 가입한 계정입니다. 카카오로 로그인해 주세요.' }));
        } else if (error.code === 2007) {
          dispatch(SET_ALERT({ alertMessage: '애플로 가입한 계정입니다. 애플로 로그인해 주세요.' }));
        } else {
          setErrorMessage('입력하신 정보로 일치하는 계정이 없습니다.');
        }
        console.error(error);
        console.error(error);
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      getHelpPassword();
    }
  };

  const isAllValid = emailValid.isValid && phoneValid.isValid;
  return (
    <Container>
      <TextB2R>아이디와 등록된 휴대폰 번호를 입력해 주시면 </TextB2R>
      <TextB2R>문자로 임시 비밀번호를 보내드립니다.</TextB2R>
      <InputWrapper>
        <TextInput
          placeholder="이메일 입력"
          ref={emailRef}
          eventHandler={emailInputHandler}
          keyPressHandler={handleKeyPress}
        />
        <TextInput
          inputType="number"
          placeholder="휴대폰 번호 입력 (-제외)"
          margin="8px 0 0 0"
          ref={phoneRef}
          eventHandler={phoneInputHandler}
          keyPressHandler={handleKeyPress}
        />
        {errorMessage && <Validation>{errorMessage}</Validation>}
      </InputWrapper>
      <BtnWrapper onClick={getHelpPassword}>
        <Button disabled={!isAllValid} height="100%" borderRadius="0">
          요청하기
        </Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 84px 24px;
`;

const InputWrapper = styled.div`
  margin-top: 28px;
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;
export default FindPasswordPage;
