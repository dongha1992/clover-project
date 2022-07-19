import React from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useToast } from '@hooks/useToast';
import { DELIVERY_METHOD } from '@constants/delivery-info';

interface IProps {
  title: string;
  copiedValue: string;
}

const DeliveryTypeInfoSheet = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const submitHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          배송안내
        </TextH5B>
        <Content>
          {DELIVERY_METHOD.pickup.map((item: any, index: number) => {
            return (
              <Item key={index}>
                <TextH5B margin="0 0 8px 0">{item.name}</TextH5B>
                <TextB3R color={theme.greyScale65}>{item.description}</TextB3R>
                <TextH6B color={theme.greyScale65}>{item.feeInfo}</TextH6B>
              </Item>
            );
          })}
          {DELIVERY_METHOD.delivery.map((item: any) => {
            return (
              <Item>
                <TextH5B margin="0 0 8px 0">{item.name}</TextH5B>
                <TextB3R color={theme.greyScale65}>{item.description}</TextB3R>
                <TextH6B color={theme.greyScale65}>{item.feeInfo}</TextH6B>
              </Item>
            );
          })}
        </Content>
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const Content = styled.div`
  display: flex;
  margin-bottom: 16px;
  flex-direction: column;
`;

const Item = styled.div`
  margin-top: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(DeliveryTypeInfoSheet);
