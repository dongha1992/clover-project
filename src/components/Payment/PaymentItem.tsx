import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextB2R } from '@components/Text';
import { theme } from '@styles/theme';
import CountButton from '@components/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Tag';

interface IProps {
  menu: any;
}

function PaymentItem({ menu }: IProps) {
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
          <PriceWrapper>
            <TextH5B color={theme.brandColor} padding={'0 4px 0 0'}>
              {menu.discount}%
            </TextH5B>
            <TextH5B>{menu.price}원</TextH5B>
            <Col />
            <TextB2R>1개</TextB2R>
          </PriceWrapper>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
}

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
  width: 60px;
  height: 60px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  width: 70%;
  height: 60px;
  margin-left: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const Col = styled.div`
  display: flex;
  width: 1px;
  height: 16px;
  background-color: ${theme.greyScale6};
  margin: 0px 8px;
`;
export default React.memo(PaymentItem);
