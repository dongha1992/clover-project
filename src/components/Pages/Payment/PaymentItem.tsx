import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';

interface IProps {
  menu: any;
  isDeliveryComplete?: boolean;
}

const PaymentItem = ({ menu, isDeliveryComplete }: IProps) => {
  const removeCartItemHandler = () => {};
  const clickRestockNoti = () => {};

  return (
    <Container>
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={menu.url} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <PriceWrapper>
              <TextH5B color={theme.brandColor} padding={'0 4px 0 0'} className="percent">
                {menu.discount}%
              </TextH5B>
              <TextH5B>{menu.price}원</TextH5B>
              <Col />
              <TextB2R>{menu.quantity}개</TextB2R>
            </PriceWrapper>
            {isDeliveryComplete ? (
              <div>
                <Button backgroundColor={theme.white} color={theme.black} border height="38px" padding="10px 16px">
                  후기 작성
                </Button>
              </div>
            ) : null}
          </FlexBetween>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isSoldout?: boolean }>`
  position: relative;
  width: 100%;
  background-color: ${theme.white};
  border-radius: 8px;
  margin-bottom: 16px;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70px;
  margin-left: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  margin-top: 2px;
`;

const Col = styled.div`
  display: flex;
  width: 1px;
  height: 16px;
  background-color: ${theme.greyScale6};
  justify-content: center;
  align-items: center;
  margin: 2px 8px;
`;
export default React.memo(PaymentItem);
