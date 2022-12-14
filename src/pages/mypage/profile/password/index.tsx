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

      const passwordLengthCheck = oldPassword.length > 3 && oldPassword.length < 21;

      if (!passwordLengthCheck) {
        setOldPasswordLengthValidation({
          isValid: false,
          message: '??????????????? 8??? ?????? ??????????????????.',
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
          message: '8~20??? ?????? / ??????, ??????, ???????????? ????????? ?????? ????????????',
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
          message: '8~20??? ?????? / ??????, ??????, ???????????? ????????? ?????? ????????????',
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
          message: '?????? ??????????????? ?????? ??????????????? ???????????????.',
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
          message: '??????????????? ???????????? ????????????.',
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
    if (!isAllVaild) return;

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
          dispatch(SET_ALERT({ alertMessage: '?????? ??????????????? ?????? ??????????????????.' }));
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
              <TextH2B>?????? ???????????????</TextH2B>
              <TextH2B>?????? ??????????????????.</TextH2B>
            </FlexCol>
          ) : (
            <OldPasswordWrapper>
              <TextH5B>?????? ????????????</TextH5B>
              <TextInput
                inputType="password"
                placeholder="?????? ???????????? ??????"
                margin="8px 0 0 0"
                eventHandler={oldPasswordInputHandler}
                ref={oldPasswordRef}
                keyPressHandler={handleKeyPress}
              />
              {oldPasswordLengthValidation.isValid && <SVGIcon name="confirmCheck" />}
              {/* {!oldPasswordLengthValidation.isValid && <Validation>{oldPasswordLengthValidation.message}</Validation>} */}
            </OldPasswordWrapper>
          )}
        </FlexCol>
        <FlexCol padding="24px 0 0 0">
          <NewPasswordWrapper>
            <TextH5B padding="0 0 9px 0">?????? ????????????</TextH5B>
            <TextInput
              inputType="password"
              placeholder="8~20??? ?????? / ??????, ??????, ???????????? ????????? ??????."
              eventHandler={newPasswordInputHandler}
              ref={newPasswordRef}
              keyPressHandler={handleKeyPress}
            />
            {newPasswordValidation.isValid &&
              newPasswordLengthValidation.isValid &&
              oldAndNewPasswordSameValidation.isValid && <SVGIcon name="confirmCheck" />}
            {newPasswordRef?.current?.value?.length! > 0 && (
              <FlexCol>
                {!newPasswordValidation.isValid && <Validation>{newPasswordValidation.message}</Validation>}
                {!newPasswordLengthValidation.isValid && <Validation>{newPasswordLengthValidation.message}</Validation>}
                {!oldAndNewPasswordSameValidation.isValid && (
                  <Validation>{oldAndNewPasswordSameValidation.message}</Validation>
                )}
              </FlexCol>
            )}
          </NewPasswordWrapper>
          <NewAgainPasswordWrapper>
            <TextInput
              placeholder="???????????? ?????????"
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
          ????????????
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
