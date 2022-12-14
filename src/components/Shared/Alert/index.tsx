import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { ModalLayout } from '@components/Shared/Modal';
import { TextB2R, TextB1R } from '@components/Shared/Text';
import { theme } from '@styles/theme';

/* TODO: alert msg 텍스트 다시 조정 */

type TProps = {
  alertMessage?: string;
  alertSubMessage?: string;
  submitBtnText?: string;
  closeBtnText?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  type?: string;
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
  width?: string;
  height?: string;
  children?: JSX.Element;
};

const Alert = ({
  alertMessage,
  alertSubMessage,
  submitBtnText = '확인',
  closeBtnText,
  onSubmit,
  onClose,
  type,
  selectedMenu,
  setSelectedMenu,
  width = '242px',
  height = '160px',
  children,
}: TProps): JSX.Element => {
  const dispatch = useDispatch();

  const cancelHandler = (): void => {
    onClose && onClose();
    dispatch(SET_ALERT(null));
  };

  const submitHandler = (): void => {
    onSubmit && onSubmit();
    dispatch(SET_ALERT(null));
  };

  return (
    <ModalLayout width={width} height={height} padding="10px" style={{ borderRadius: '8px' }}>
      <AlertBox>
        {children}
        <AlertText>
          <TextB1R center wordWrap="break-word" wordBreak="keep-all">
            {alertMessage}
          </TextB1R>
          <TextB2R center wordWrap="break-word" wordBreak="keep-all" color={theme.greyScale65} margin="5px 0 0 0">
            {alertSubMessage}
          </TextB2R>
        </AlertText>
        <AlertBtnBox>
          {closeBtnText && (
            <button className="cancelBtn" onClick={cancelHandler}>
              {closeBtnText ? closeBtnText : '취소'} {type}
            </button>
          )}
          {submitBtnText && (
            <>
              <div className="col" />
              <button className="confirmBtn" onClick={submitHandler}>
                {submitBtnText}
              </button>
            </>
          )}
        </AlertBtnBox>
      </AlertBox>
    </ModalLayout>
  );
};

const AlertBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 24px;
  z-index: 10001;
`;

const AlertText = styled.div`
  text-align: center;
  /* padding: 45px 30px; */
`;

const AlertBtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 24px;

  .cancelBtn {
    width: 100%;
    font-weight: normal;
  }

  .confirmBtn {
    width: 100%;
  }

  button {
    width: 50px;
    height: 30px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: white;
    font-size: 14px;
    letter-spacing: -0.4px;
    font-weight: bold;
    line-height: 24px;
    color: ${theme.black};
  }

  button:hover {
    opacity: 0.8;
  }

  .col {
    background-color: ${({ theme }) => theme.greyScale6};
    width: 1px;
    height: 16px;
  }
`;

export default Alert;
