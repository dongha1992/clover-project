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
}

const CartActualItem = ({
  removeCartActualItemHandler,
  clickPlusButton,
  clickMinusButton,
  menuId,
  menuDetail,
  holiday,
  menuName,
}: IProps) => {
  const { discount, discountedPrice } = getDiscountPrice({
    discountPrice: menuDetail?.discountPrice,
    price: menuDetail?.price,
  });

  const { menuDetailAvailabilityMessage, availability, remainingQuantity } = menuDetail?.availabilityInfo;

  //PERIOD?
  const defaultStatus = availability && !remainingQuantity;
  const isSold = menuDetail.isSold;

  const personLimit = menuDetailAvailabilityMessage === 'PERSON';
  const holidayLimit = menuDetailAvailabilityMessage === 'HOLIDAY';
  const dateLimit = menuDetailAvailabilityMessage === 'DAILY' || 'WEEKLY';

  const isPersonLimit = personLimit && (!remainingQuantity || !availability);
  const soldCases = isSold;

  const checkMenuStatus = (): string => {
    switch (true) {
      case holidayLimit: {
        return `${getHolidayByMenu(holiday!)} 배송이 불가능해요`;
      }
      case isSold:
        return '품절된 상품이에요.';

      case dateLimit: {
        let message = '';
        if (availability) {
          message = `품절 임박! 상품이 ${remainingQuantity}개 남았어요.`;
        } else {
          message = '선택한 날짜에 상품이 품절됐어요';
        }
        return message;
      }
      case personLimit: {
        let message = '';
        if (isPersonLimit) {
          message = '구매 가능한 수량을 초과했어요';
        } else {
          message = `최대 ${remainingQuantity}개까지 구매 가능해요`;
        }
        return message;
      }

      default:
        return '품절된 상품이에요.(임시메시지)';
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
              removeCartActualItemHandler({
                menuId,
                menuDetailId: menuDetail?.menuDetailId || menuDetail?.id,
                cartId: menuDetail?.cartId!,
              })
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
                available={menuDetail?.availabilityInfo}
                personLimit={personLimit}
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
