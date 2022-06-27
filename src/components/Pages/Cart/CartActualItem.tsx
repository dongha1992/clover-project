import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexBetween, theme, FlexCol, FlexBetweenStart } from '@styles/theme';
import CountButton from '@components/Shared/Button/CountButton';
import { SVGIcon } from '@utils/common';
import { Tag } from '@components/Shared/Tag';
import InfoMessage from '@components/Shared/Message';
import { IMenuDetailsInCart } from '@model/index';
import { getDiscountPrice } from '@utils/menu';
interface IProps {
  removeCartActualItemHandler: ({ menuDetailId, menuId }: { menuDetailId: number; menuId: number }) => void;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
  menuId: number;
  menuDetail: IMenuDetailsInCart;
  holiday: number[][];
}

/* TODO: InfoMessage 이거 수정해야 함. 서버에서 들어오는 값 보고  */

const CartActualItem = ({
  removeCartActualItemHandler,
  clickPlusButton,
  clickMinusButton,
  menuId,
  menuDetail,
  holiday,
}: IProps) => {
  const { discount, discountedPrice } = getDiscountPrice({
    discountPrice: menuDetail.discountPrice,
    price: menuDetail.price,
  });
  console.log(menuDetail, 'menuDetail');
  return (
    <Container isSold={menuDetail.isSold}>
      <ContentWrapper>
        <FlexBetween>
          <TextB3R>{!menuDetail.main ? `[선택옵션] ${menuDetail.name}` : menuDetail.name}</TextB3R>
          <div
            onClick={() =>
              removeCartActualItemHandler &&
              removeCartActualItemHandler({ menuDetailId: menuDetail.menuDetailId, menuId })
            }
          >
            <SVGIcon name="defaultCancel" />
          </div>
        </FlexBetween>
        <FlexCol>
          <PriceWrapper>
            <TextH5B color={menuDetail.isSold ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
              {discount}%
            </TextH5B>
            <TextH5B>{discountedPrice}원</TextH5B>
          </PriceWrapper>
          <FlexBetweenStart>
            <InfoMessage status={menuDetail.isSold && 'isSold'} />
            <CountButtonContainer>
              <CountButton
                isSold={menuDetail.isSold}
                menuDetailId={menuDetail.id}
                quantity={menuDetail.quantity}
                clickPlusButton={clickPlusButton}
                clickMinusButton={clickMinusButton}
              />
            </CountButtonContainer>
          </FlexBetweenStart>
        </FlexCol>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div<{ isSold?: boolean }>`
  display: flex;
  color: ${({ isSold }) => isSold && theme.greyScale25};
  background-color: ${theme.greyScale3};
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  position: relative;
  margin-left: 28px;
`;

const ContentWrapper = styled.div`
  margin-left: 8px;
  width: 100%;
  height: 70px;
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const CountButtonContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

export default React.memo(CartActualItem);
