import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Text';
import { theme } from '@styles/theme';
import CountButton from '@components/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import Tag from '@components/Tag';
interface IProps {
  menu: any;
  isShareSheet?: boolean;
  isCart?: boolean;
  isSoldout?: boolean;
}

function CartSheetItem({ menu, isShareSheet, isCart, isSoldout }: IProps) {
  const removeCartItemHandler = () => {};
  const clickRestockNoti = () => {};
  return (
    <Container isSoldout={isSoldout}>
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={menu.url} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <PriceWrapper>
            <TextH5B
              color={isSoldout ? theme.greyScale25 : theme.brandColor}
              padding={'0 4px 0 0'}
            >
              {menu.discount}%
            </TextH5B>
            <TextH5B>{menu.price}원</TextH5B>
          </PriceWrapper>
          {!isShareSheet && !isCart && (
            <RemoveBtnContainer onClick={removeCartItemHandler}>
              <SVGIcon name="defaultCancel" />
            </RemoveBtnContainer>
          )}
          {!isShareSheet && (
            <CountButtonContainer>
              {isSoldout ? (
                <Tag
                  backgroundColor={theme.black}
                  padding="7px 12px"
                  margin="0"
                  borderRadius={32}
                  onClick={clickRestockNoti}
                >
                  <TextH6B color={theme.white}>재입고 알림</TextH6B>
                </Tag>
              ) : (
                <CountButton quantity={menu.quantity} />
              )}
            </CountButtonContainer>
          )}
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div<{ isSoldout?: boolean }>`
  position: relative;
  width: 100%;
  height: 92px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
`;

const Wrapper = styled.div`
  display: flex;
  padding: 16px;
`;

const ImageWrapper = styled.div`
  width: 60px;
  height: 60px;
`;
const ContentWrapper = styled.div`
  margin-left: 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const RemoveBtnContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const CountButtonContainer = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(CartSheetItem);
