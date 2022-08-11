import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import Image from '@components/Shared/Image';
import { menuSelector } from '@store/menu';
import { useSelector, useDispatch } from 'react-redux';
import { getMenuOptionPrice } from '@utils/menu/getMenuDisplayPrice';
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
  // 임시
  const { menuItem } = useSelector(menuSelector);
  const { discount, discountedPrice } = getMenuOptionPrice(menu);

  // TAYLER 이거 객체로 들어와서 수정하겠습니다.

  // const thumbnailUrl = (menu.thumbnail || [])[0] || {};
  const thumbnailUrl = menu?.thumbnail?.url || '';

  return (
    <Container isSold={menu.isSold} padding={padding} isCart={isCart}>
      <Wrapper>
        <ImageWrapper>
          <Image src={thumbnailUrl} alt="상품이미지" layout="responsive" width={'100%'} height={'100%'} />
        </ImageWrapper>
        <ContentWrapper>
          <TextB3R>{menu.name}</TextB3R>
          <FlexBetween>
            <PriceWrapper>
              <TextH5B color={isSoldout ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
                {discount}%
              </TextH5B>
              <TextH5B>{discountedPrice.toLocaleString()}원</TextH5B>
            </PriceWrapper>
            {!isCart && (
              <RemoveBtnContainer onClick={() => removeCartItemHandler && removeCartItemHandler(menu.menuDetailId)}>
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
                  menuDetailId={menu.menuDetailId}
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
  isSold?: boolean;
  isCart?: boolean;
  padding?: string;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ isCart }) => (isCart ? theme.white : theme.greyScale3)};
  border-radius: 8px;
  margin-bottom: 8px;
  color: ${({ isSold }) => isSold && theme.greyScale25};
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
  cursor: pointer;
`;

const CountButtonContainer = styled.div`
  margin-top: 10px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(CartSheetItem);
