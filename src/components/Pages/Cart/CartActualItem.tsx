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
import { getFormatPrice } from '@utils/common';
import { getHolidayByMenu } from '@utils/menu';
/* TODO: 최대 구매? */

// 판매중지일 먼저
// 어느 날짜에나 스태퍼는 동일. 인당 제한만
interface IProps {
  removeCartActualItemHandler: ({
    menuDetailId,
    menuId,
    cartId,
  }: {
    menuDetailId: number;
    menuId: number;
    cartId: number;
  }) => void;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
  menuId: number;
  menuDetail: IMenuDetailsInCart;
  holiday: number[][] | null;
  menuName: string;
  cartId: number;
}

/* TODO: InfoMessage 이거 수정해야 함. 서버에서 들어오는 값 보고  */

const CartActualItem = ({
  removeCartActualItemHandler,
  clickPlusButton,
  clickMinusButton,
  menuId,
  menuDetail,
  holiday,
  menuName,
  cartId,
}: IProps) => {
  const { discount, discountedPrice } = getDiscountPrice({
    discountPrice: menuDetail?.discountPrice,
    price: menuDetail?.price,
  });

  console.log(menuDetail.availabilityInfo, holiday, 'menuDetail.availabilityInfo, holiday');

  const hasLimitDate = holiday?.length! > 0;
  const isSold = menuDetail.isSold;
  const { availability, remainingQuantity, menuDetailAvailabilityMessage } = menuDetail?.availabilityInfo!;
  const personLimitQuantity = menuDetailAvailabilityMessage === 'PERSON';
  const hasPersonLimit = personLimitQuantity && (!remainingQuantity || !availability);

  const hasLimitQuantity = !personLimitQuantity && remainingQuantity !== 0;
  const defaultStatus = availability && !remainingQuantity;
  const soldCases = isSold || hasPersonLimit || !availability;

  const checkMenuStatus = (): string => {
    switch (true) {
      case hasLimitDate: {
        return `${getHolidayByMenu(holiday!)} 배송이 불가능해요`;
      }
      case isSold:
      case !availability: {
        return '품절된 상품이에요.';
      }

      case hasLimitQuantity: {
        let message = '';
        if (availability) {
          message = `품절 임박! 상품이 ${remainingQuantity}개 남았어요.`;
        } else {
          message = '품절된 상품이에요.';
        }
        return message;
      }
      case personLimitQuantity: {
        let message = '';
        if (hasPersonLimit) {
          message = '구매 가능한 수량을 초과했어요';
        } else {
          message = `최대 ${remainingQuantity}개까지 구매 가능해요`;
        }
        return message;
      }

      default:
        return '';
    }
  };

  return (
    <Container isSold={soldCases}>
      <ContentWrapper>
        <FlexBetween>
          <TextB3R margin="0 16px 0 0">
            {!menuDetail?.main ? `[선택옵션] ${menuDetail?.name}` : `${menuName} / ${menuDetail?.name}`}
          </TextB3R>
          <div
            onClick={() =>
              removeCartActualItemHandler &&
              removeCartActualItemHandler({ menuDetailId: menuDetail?.menuDetailId, menuId, cartId })
            }
          >
            <SVGIcon name="defaultCancel" />
          </div>
        </FlexBetween>
        <FlexCol>
          <PriceWrapper>
            <TextH5B color={soldCases ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
              {discount}%
            </TextH5B>
            <TextH5B>{getFormatPrice(String(discountedPrice))}원</TextH5B>
          </PriceWrapper>
          <InfoContainer>
            {!defaultStatus ? <InfoMessage message={checkMenuStatus()} /> : <div />}
            <CountButtonContainer>
              <CountButton
                isSold={soldCases}
                menuDetailId={menuDetail?.id}
                quantity={menuDetail?.quantity}
                clickPlusButton={clickPlusButton}
                clickMinusButton={clickMinusButton}
              />
            </CountButtonContainer>
          </InfoContainer>
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
  height: 100%;
`;

const ContentWrapper = styled.div`
  margin-left: 8px;
  width: 100%;
  /* height: 70px; */
`;

const PriceWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const CountButtonContainer = styled.div`
  /* position: absolute; */
  bottom: 12px;
  right: 12px;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;

  height: 100%;
`;
export default React.memo(CartActualItem);
