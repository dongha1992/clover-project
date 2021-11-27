import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import ModalLayout from '../../components/Modal';

type TProps = {
  alertMessage: string;
  submitBtnText?: string;
  closeBtnText?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  type?: string;
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
  width?: string;
  height?: string;
};

function Alert({
  alertMessage,
  submitBtnText = '확인',
  closeBtnText = '취소',
  onSubmit,
  onClose,
  type,
  selectedMenu,
  setSelectedMenu,
  width = '242px',
  height = '160px',
}: TProps): JSX.Element {
  const dispatch = useDispatch();

  const cancelHandler = (): void => {
    onClose && onClose();
    dispatch(setAlert(null));
  };

  const submitHandler = (): void => {
    onSubmit && onSubmit();
    dispatch(setAlert(null));
    //  selectedMenu === '로그아웃' && setSelectedMenu && setSelectedMenu('');
  };
  return (
    <ModalLayout
      width={width}
      height={height}
      padding="10px"
      style={{ borderRadius: '8px' }}
    >
      <AlertBox>
        <AlertText>{alertMessage}</AlertText>
        <AlertBtnBox>
          <button className="cancelBtn" onClick={cancelHandler}>
            {closeBtnText} {type}
          </button>
          <div className="col" />
          <button className="confirmBtn" onClick={submitHandler}>
            {submitBtnText}
          </button>
        </AlertBtnBox>
      </AlertBox>
    </ModalLayout>
  );
}

const AlertBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AlertText = styled.div`
  display: flex;
  align-items: center;
  font-size: 17px;
  padding: 45px 30px;
`;

const AlertBtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;

  .cancelBtn {
    margin-right: 23px;
  }

  .confirmBtn {
    margin-left: 23px;
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