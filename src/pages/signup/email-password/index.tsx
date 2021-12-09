import React, { useState, useEffect, useRef, isValidElement } from 'react';
import styled from 'styled-components';
import { TextH2B, TextH5B } from '@components/Text';
import { homePadding, fixedBottom, FlexCol } from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import debounce from 'lodash-es/debounce';
import router from 'next/router';
import Validation from '@components/Validation';
import { Api } from '@api/index';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { userForm, SET_SIGNUP_USER } from '@store/user';
import { availabilityEmail } from '@api/v2';

const SVGIcon = dynamic(() => import('../../../utils/SVGIcon'), {
  ssr: false,
});

export const EMAIL_REGX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PASSWORD_REGX = /[ \{\}\[\]\/?.,;:|\)~`\-_+┼<>\\'\"\\\(\=]/;

interface IVaildation {
  message: string;
  isValid: boolean;
}

function emailAndPassword() {
  const [emailValidation, setEmailValidataion] = useState<IVaildation>({
    message: '',
    isValid: false,
  });
  const [passwordValidation, setPasswordValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [passwordLengthValidation, setPasswordLengthValidation] =
    useState<IVaildation>({ message: '', isValid: false });

  const [passwordSameValidation, setPasswordSameValidation] =
    useState<IVaildation>({ message: '', isValid: false });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordAgainRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { signupUser } = useSelector(userForm);

  useEffect(() => {}, []);

  const emailInputHandler = (): void => {
    if (emailRef.current) {
      const email = emailRef.current?.value;
      const checkEmailRegx = EMAIL_REGX.test(email);
      if (checkEmailRegx) {
        setEmailValidataion({
          isValid: true,
          message: '',
        });

        /* 이메일 중복 검사 */
        getAvailabilityEmail();
      } else {
        setEmailValidataion({
          isValid: false,
          message: '이메일 형식이 올바르지 않습니다.',
        });
      }
    }
  };

  const getAvailabilityEmail = async () => {
    if (emailRef.current) {
      const email = emailRef.current?.value;
      const {
        data: { data: availability },
      } = await availabilityEmail({ email });
      /* TODO: 탈퇴 res? */

      if (availability) {
        setEmailValidataion({
          isValid: true,
          message: '',
        });
      } else {
        setEmailValidataion({
          isValid: false,
          message: '사용 중인 이메일 주소입니다.',
        });
      }
    }
  };

  const passwordInputHandler = (): void => {
    if (passwordRef.current) {
      const password = passwordRef.current?.value;

      const passwordLengthCheck = password.length > 7 && password.length < 21;

      if (!passwordLengthCheck) {
        setPasswordLengthValidation({
          isValid: false,
          message: '비밀번호를 8자 이상 입력해주세요.',
        });
      } else {
        setPasswordLengthValidation({
          isValid: true,
          message: '',
        });
      }

      if (PASSWORD_REGX.test(password)) {
        setPasswordValidation({
          isValid: false,
          message: '영문자 + 숫자 조합으로 최소 8자 최대 20자 이내여야 합니다.',
        });
      } else {
        setPasswordValidation({
          isValid: true,
          message: '',
        });
      }
    }
  };

  const passwordAginInputHandler = () => {
    if (passwordRef.current && passwordAgainRef.current) {
      const password = passwordRef.current.value;
      const passwordAgain = passwordAgainRef.current.value;

      if (password !== passwordAgain) {
        setPasswordSameValidation({
          message: '비밀번호가 다릅니다.',
          isValid: false,
        });
      } else {
        setPasswordSameValidation({
          message: '',
          isValid: true,
        });
      }
    }
  };

  const goToOptionalInfo = () => {
    dispatch(
      SET_SIGNUP_USER({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      })
    );
    router.push('/signup/optional');
  };

  const isAllVaild =
    passwordSameValidation.isValid &&
    passwordValidation.isValid &&
    passwordLengthValidation.isValid &&
    emailValidation.isValid;

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
            value={signupUser.email ? signupUser.email : ''}
          />
          {!emailValidation.isValid ? (
            <Validation>{emailValidation.message}</Validation>
          ) : (
            <SVGIcon name="confirmCheck" />
          )}
        </NameInputWrapper>
        <PasswordInputWrapper>
          <TextH5B padding="0 0 9px 0">비밀번호</TextH5B>
          <FlexCol>
            <FirstPasswordWrapper>
              <TextInput
                placeholder="비밀번호"
                ref={passwordRef}
                eventHandler={debounce(passwordInputHandler, 300)}
              />
              {passwordValidation.isValid &&
                passwordLengthValidation.isValid && (
                  <SVGIcon name="confirmCheck" />
                )}
              <ValidationWrapper>
                {!passwordValidation.isValid && (
                  <Validation>{passwordValidation.message}</Validation>
                )}
                {!passwordLengthValidation.isValid && (
                  <Validation>{passwordLengthValidation.message}</Validation>
                )}
              </ValidationWrapper>
            </FirstPasswordWrapper>
            <SecondPasswordWrapper>
              <TextInput
                placeholder="비밀번호 확인"
                ref={passwordAgainRef}
                eventHandler={debounce(passwordAginInputHandler, 300)}
                margin="8px 0 0 0"
              />
              {passwordValidation.isValid &&
                passwordLengthValidation.isValid &&
                passwordSameValidation.isValid && (
                  <SVGIcon name="confirmCheck" />
                )}
            </SecondPasswordWrapper>
            <ValidationWrapper>
              {!passwordSameValidation.isValid && (
                <Validation>{passwordSameValidation.message}</Validation>
              )}
            </ValidationWrapper>
          </FlexCol>
        </PasswordInputWrapper>
      </Wrapper>
      <NextBtnWrapper onClick={goToOptionalInfo}>
        <Button disabled={!isAllVaild} borderRadius="0" height="100%">
          다음
        </Button>
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

const NameInputWrapper = styled.div`
  position: relative;

  > svg {
    position: absolute;
    right: 5%;
    bottom: 25%;
  }
`;

const PasswordInputWrapper = styled.div`
  margin-top: 24px;
  position: relative;
`;

const ValidationWrapper = styled.div``;

const NextBtnWrapper = styled.div`
  ${fixedBottom}
`;

const FirstPasswordWrapper = styled.div`
  position: relative;
  > svg {
    position: absolute;
    right: 5%;
    bottom: 40%;
  }
`;
const SecondPasswordWrapper = styled.div`
  position: relative;

  > svg {
    position: absolute;
    right: 5%;
    bottom: 38%;
  }
`;

export default React.memo(emailAndPassword);
