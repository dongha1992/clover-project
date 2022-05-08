import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { SET_SPOT_PICKUP_ID } from '@store/spot';
import Checkbox from '@components/Shared/Checkbox';
import { ISpotPickupInfo } from '@model/index';

type TPrams = {
  onSubmit?: () => void;
  content?: string;
}

const SpotStatusRejectedSheet = ({ onSubmit, content }: TPrams): JSX.Element => {
  const dispatch = useDispatch();

  const submitHandler = (): void => {
    onSubmit && onSubmit();
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          오픈 미진행 안내
        </TextH5B>
        <Content>
          <TextB2R padding='16px 0 24px 0'>{content}</TextB2R>
          <BtnWrapper>
            <Button color={theme.black} backgroundColor={theme.white} border onClick={()=>{}}>채팅 문의</Button>
          </BtnWrapper>
        </Content>
      </Wrapper>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
`;

const Wrapper = styled.div`
  ${homePadding}
`;

const Content = styled.div``;

const BtnWrapper = styled.div``;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(SpotStatusRejectedSheet);
