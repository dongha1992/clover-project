import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { ACCESS_METHOD } from '@constants/order';
import { IAccessMethod } from '@pages/order';
import { SET_ACCESS_METHOD } from '@store/common';

interface IProps {
  userAccessMethod: IAccessMethod | undefined;
}

const AccessMethodSheet = ({ userAccessMethod }: IProps) => {
  const [selectedAccessMethod, setSelectedAccessMethod] = useState<IAccessMethod | undefined>(undefined);

  const dispatch = useDispatch();

  const changeRadioHandler = (place: IAccessMethod) => {
    setSelectedAccessMethod(place);
  };

  const submitHandler = () => {
    dispatch(SET_ACCESS_METHOD(selectedAccessMethod));
    dispatch(INIT_BOTTOM_SHEET());
  };

  useEffect(() => {
    setSelectedAccessMethod(userAccessMethod);
  }, [userAccessMethod]);

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          출입방법
        </TextH5B>
        {ACCESS_METHOD.map((method, index) => {
          const isSelected = selectedAccessMethod?.id === method.id;
          return (
            <PickWrapper key={index}>
              <RadioButton onChange={() => changeRadioHandler(method)} isSelected={isSelected} margin="0 0 2px" />
              {isSelected ? (
                <TextH5B
                  padding="0 0 0 8px"
                  onClick={() => {
                    changeRadioHandler(method);
                  }}
                >
                  {method.text}
                </TextH5B>
              ) : (
                <TextB2R
                  padding="0 0 0 8px"
                  onClick={() => {
                    changeRadioHandler(method);
                  }}
                >
                  {method.text}
                </TextB2R>
              )}
            </PickWrapper>
          );
        })}
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          선택하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const PickWrapper = styled.div`
  cursor: pointer;
  display: flex;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(AccessMethodSheet);
