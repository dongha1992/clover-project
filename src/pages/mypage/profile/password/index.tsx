import { TextH2B, TextH5B } from '@components/Shared/Text';
import { homePadding, FlexCol, fixedBottom } from '@styles/theme';
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import { useSelector, useDispatch } from 'react-redux';
import { userForm } from '@store/user';
import Validation from '@components/Pages/User/Validation';
import { PASSWORD_REGX } from '@pages/signup/email-password';
import { SVGIcon } from '@utils/common';
import { userChangePassword } from '@api/user';
import router from 'next/router';
import { INIT_TEMP_PASSWORD } from '@store/user';
import { SET_ALERT } from '@store/alert';

interface IVaildation {
  message: string;
  isValid: boolean;
}

const ChangePasswordPage = () => {
  const [oldPasswordLengthValidation, setOldPasswordLengthValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [newPasswordLengthValidation, setNewPasswordLengthValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [newPasswordValidation, setNewPasswordValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [newPasswordSameValidation, setNewPasswordSameValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const [oldAndNewPasswordSameValidation, setOldAndNewPasswordSameValidation] = useState<IVaildation>({
    message: '',
    isValid: false,
  });

  const { tempPasswordLogin } = useSelector(userForm);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newAgainPasswordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const oldPasswordInputHandler = () => {
    if (oldPasswordRef.current) {
      const oldPassword = oldPasswordRef.current?.value;
      const password = newPasswordRef.current?.value;

      const passwordLengthCheck = oldPassword.length > 7 && oldPassword.length < 21;

      if (!passwordLengthCheck) {
        setOldPasswordLengthValidation({
          isValid: false,
          message: '비밀번호를 8자 이상 입력해주세요.',
        });
      } else {
        setOldPasswordLengthValidation({
          isValid: true,
          message: '',
        });
      }

      if (password) {
        oldAndNewSamePasswordCheck();
      }
    }
  };

  const newPasswordInputHandler = () => {
    if (newPasswordRef.current) {
      const oldPassword = oldPasswordRef.current?.value;
      const password = newPasswordRef.current?.value;
      const newAgainPassword = newAgainPasswordRef.current?.value;
      const passwordLengthCheck = password.length > 7 && password.length < 21;

      if (password && !passwordLengthCheck) {
        setNewPasswordLengthValidation({
          isValid: false,
          message: '비밀번호를 8자 이상 입력해주세요.',
        });
      } else {
        setNewPasswordLengthValidation({
          isValid: true,
          message: '',
        });
      }

      if (PASSWORD_REGX.test(password)) {
        setNewPasswordValidation({
          isValid: false,
          message: '8~20자 이내 / 영문, 숫자, 특수문자 일부만 입력 가능해요',
        });
      } else if (passwordLengthCheck) {
        setNewPasswordValidation({
          isValid: true,
          message: '',
        });
      } else {
        setNewPasswordValidation({
          isValid: false,
          message: '',
        });
      }

      oldAndNewSamePasswordCheck();

      if (newAgainPassword) {
        samePasswordCheck();
      }
    }
  };

  const newAgainPasswordInputHandler = () => {
    samePasswordCheck();
  };

  const oldAndNewSamePasswordCheck = () => {
    if (newPasswordRef.current) {
      const oldPassword = oldPasswordRef.current?.value;
      const password = newPasswordRef.current?.value;
      if (oldPassword && oldPassword === password) {
        setOldAndNewPasswordSameValidation({
          message: '기존 비밀번호와 신규 비밀번호가 동일합니다.',
          isValid: false,
        });
      } else {
        setOldAndNewPasswordSameValidation({
          message: '',
          isValid: true,
        });
      }
    }
  };

  const samePasswordCheck = () => {
    if (newPasswordRef.current && newAgainPasswordRef.current) {
      const password = newPasswordRef.current.value;
      const passwordAgain = newAgainPasswordRef.current.value;

      if (password !== passwordAgain) {
        setNewPasswordSameValidation({
          message: '비밀번호가 일치하지 않습니다.',
          isValid: false,
        });
      } else {
        setNewPasswordSameValidation({
          message: '',
          isValid: true,
        });
      }
    }
  };

  const getChangePassword = async () => {
    if (newPasswordRef.current) {
      const oldPassword = oldPasswordRef.current?.value.toString();
      const newPassword = newPasswordRef.current?.value.toString();

      const reqBody = {
        oldPassword: tempPasswordLogin ? tempPasswordLogin : oldPassword,
        newPassword,
      };

      try {
        const { data } = await userChangePassword(reqBody);
        if (data.code === 200) {
          router.replace('/mypage/profile');
          dispatch(INIT_TEMP_PASSWORD());
        }
      } catch (error: any) {
        console.error(error);
        if (error.code === 2109) {
          dispatch(SET_ALERT({ alertMessage: '기존 비밀번호를 다시 입력해주세요.' }));
        } else {
          dispatch(SET_ALERT({ alertMessage: error.message }));
        }
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      getChangePassword();
    }
  };

  const isAllVaild =
    newPasswordSameValidation.isValid &&
    newPasswordValidation.isValid &&
    newPasswordLengthValidation.isValid &&
    oldAndNewPasswordSameValidation.isValid;

  return (
    <Container>
      <Wrapper>
        <FlexCol>
          {tempPasswordLogin ? (
            <FlexCol padding="0 0 56px 0">
              <TextH2B>임시 비밀번호를</TextH2B>
              <TextH2B>바로 변경해주세요.</TextH2B>
            </FlexCol>
          ) : (
            <OldPasswordWrapper>
              <TextH5B>기존 비밀번호</TextH5B>
              <TextInput
                inputType="password"
                placeholder="비밀번호를 8자 이상 입력해주세요."
                margin="8px 0 0 0"
                eventHandler={oldPasswordInputHandler}
                ref={oldPasswordRef}
                keyPressHandler={handleKeyPress}
              />
              {oldPasswordLengthValidation.isValid && <SVGIcon name="confirmCheck" />}
              {!oldPasswordLengthValidation.isValid && <Validation>{oldPasswordLengthValidation.message}</Validation>}
            </OldPasswordWrapper>
          )}
        </FlexCol>
        <FlexCol padding="24px 0 0 0">
          <NewPasswordWrapper>
            <TextH5B padding="0 0 9px 0">신규 비밀번호</TextH5B>
            <TextInput
              inputType="password"
              placeholder="8~20자 이내 / 영문, 숫자, 특수문자 일부만 입력 가능해요."
              eventHandler={newPasswordInputHandler}
              ref={newPasswordRef}
              keyPressHandler={handleKeyPress}
            />
            {newPasswordValidation.isValid &&
              newPasswordLengthValidation.isValid &&
              oldAndNewPasswordSameValidation.isValid && <SVGIcon name="confirmCheck" />}
            <FlexCol>
              {!newPasswordValidation.isValid && <Validation>{newPasswordValidation.message}</Validation>}
              {!newPasswordLengthValidation.isValid && <Validation>{newPasswordLengthValidation.message}</Validation>}
              {!oldAndNewPasswordSameValidation.isValid && (
                <Validation>{oldAndNewPasswordSameValidation.message}</Validation>
              )}
            </FlexCol>
          </NewPasswordWrapper>
          <NewAgainPasswordWrapper>
            <TextInput
              placeholder="비밀번호 재입력"
              eventHandler={newAgainPasswordInputHandler}
              ref={newAgainPasswordRef}
              inputType="password"
              keyPressHandler={handleKeyPress}
            />
            {newPasswordValidation.isValid &&
              newPasswordLengthValidation.isValid &&
              newPasswordSameValidation.isValid &&
              oldAndNewPasswordSameValidation.isValid && <SVGIcon name="confirmCheck" />}
            {!newPasswordSameValidation.isValid && <Validation>{newPasswordSameValidation.message}</Validation>}
          </NewAgainPasswordWrapper>
        </FlexCol>
      </Wrapper>
      <BtnWrpper onClick={getChangePassword}>
        <Button disabled={!isAllVaild} height="100%" borderRadius="0">
          변경하기
        </Button>
      </BtnWrpper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div`
  padding-top: 24px;
`;
const BtnWrpper = styled.div`
  ${fixedBottom}
`;

const OldPasswordWrapper = styled.div`
  position: relative;
  > svg {
    position: absolute;
    right: 5%;
    bottom: 25%;
  }
`;

const NewPasswordWrapper = styled.div`
  position: relative;
  margin: 8px 0 9px 0;
  position: relative;
  > svg {
    position: absolute;
    right: 5%;
    bottom: 25%;
  }
`;

const NewAgainPasswordWrapper = styled.div`
  position: relative;
  position: relative;
  > svg {
    position: absolute;
    right: 5%;
    bottom: 40%;
  }
`;

export default ChangePasswordPage;
