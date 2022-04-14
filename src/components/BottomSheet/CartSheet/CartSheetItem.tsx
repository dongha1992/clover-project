import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import SVGIcon from '@utils/SVGIcon';
import { Tag } from '@components/Shared/Tag';

interface IProps {
  menu: any;
  isCart?: boolean;
  isSoldout?: boolean;
  padding?: string;
  removeCartItemHandler?: (id: number) => void;
  clickPlusButton: (id: number, quantity: number) => void;
  clickMinusButton: (id: number, quantity: number) => void;
  clickRestockNoti?: () => void;
}

/* TODO: 아 props로 패딩 주고 싶지 않아... 이거 컴포넌트 나누기 */

const CartSheetItem = ({
  menu,
  isSoldout,
  padding,
  isCart,
  removeCartItemHandler,
  clickPlusButton,
  clickMinusButton,
  clickRestockNoti,
}: IProps) => {
  return (
    <Container isSoldout={isSoldout} padding={padding} isCart={isCart}>
      <Wrapper>
        <ImageWrapper>
          <ItemImage src={menu.url} alt="상품이미지" />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <PriceWrapper>
              <TextH5B color={isSoldout ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
                {menu.discount}%
              </TextH5B>
              <TextH5B>{menu.price}원</TextH5B>
            </PriceWrapper>
            {!isCart && (
              <RemoveBtnContainer onClick={() => removeCartItemHandler && removeCartItemHandler(menu.id)}>
                <SVGIcon name="defaultCancel" />
              </RemoveBtnContainer>
            )}
            <CountButtonContainer>
              {isSoldout ? (
                <Tag backgroundColor={theme.black} padding="6px 10px" borderRadius={32} onClick={clickRestockNoti}>
                  <TextH6B color={theme.white}>재입고 알림</TextH6B>
                </Tag>
              ) : (
                <CountButton
                  id={menu.id}
                  quantity={menu.quantity}
                  clickPlusButton={clickPlusButton}
                  clickMinusButton={clickMinusButton}
                />
              )}
            </CountButtonContainer>
          </FlexBetween>
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{
  isSoldout?: boolean;
  isCart?: boolean;
  padding?: string;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ isCart }) => (isCart ? theme.white : theme.greyScale3)};
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${({ isSoldout }) => isSoldout && theme.greyScale25};
  padding: ${({ padding }) => padding && padding};
`;

const Wrapper = styled.div`
  display: flex;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ContentWrapper = styled.div`
  margin-left: 8px;
  width: 100%;
  height: 60px;
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
  margin-top: 10px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(CartSheetItem);
