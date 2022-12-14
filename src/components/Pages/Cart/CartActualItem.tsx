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
import { getCustomDate } from '@utils/destination';

const VALID_DAYS = 14;

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
  holiday?: number[][] | null;
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
  const { years: curYear, months: curMonth, dates: curDay } = getCustomDate();

  const isSold = menuDetail.isSold;
  const isValidHoliday =
    holiday?.filter((item) => {
      const year = item[0];
      const month = item[1];
      const day = item[2];
      const sameYear = year === curYear;
      const sameMonth = month === curMonth + 1;
      const withInTwoWeeks = curDay + VALID_DAYS <= day;
      if (sameYear && sameMonth && withInTwoWeeks) {
        return item;
      }
    }).length !== 0;

  // TODO: MENU_DETAIL_SOLD CASE

  const noLimit = menuDetailAvailabilityMessage === 'NONE';
  const personLimit = menuDetailAvailabilityMessage === 'PERSON';
  const holidayLimit = menuDetailAvailabilityMessage === 'HOLIDAY';
  const periodLimit = menuDetailAvailabilityMessage === 'EVENT';
  const dateLimit = ['DAILY', 'WEEKLY'].includes(menuDetailAvailabilityMessage);

  const isPersonLimit = personLimit && !availability;
  const soldCases = isSold || (periodLimit && !availability);

  const defaultStatus = (availability && remainingQuantity === 0) || holidayLimit || noLimit;

  const checkMenuStatus = (): string => {
    switch (true) {
      case isSold:
        return '????????? ???????????????.';

      case dateLimit: {
        let message = '';
        if (availability && remainingQuantity > 0) {
          message = `?????? ??????! ????????? ${remainingQuantity}??? ????????????.`;
        } else {
          message = '????????? ????????? ????????? ???????????????';
        }
        return message;
      }

      case periodLimit: {
        let message = '';
        if (availability && remainingQuantity > 0) {
          message = `?????? ??????! ????????? ${remainingQuantity}??? ????????????.`;
        } else {
          message = '????????? ???????????????.';
        }
        return message;
      }

      case personLimit: {
        let message = '';
        if (isPersonLimit) {
          message = '?????? ????????? ????????? ???????????????';
        } else {
          message = `?????? ${remainingQuantity}????????? ?????? ????????????`;
        }
        return message;
      }

      default: {
        let message = '';
        if (availability) {
          message = `?????? ??????! ????????? ${remainingQuantity}??? ????????????.`;
        } else {
          message = '????????? ????????? ????????? ???????????????';
        }
        return message;
      }
    }
  };

  return (
    <Container isSold={soldCases}>
      <ContentWrapper>
        <FlexBetween>
          <TextB3R margin="0 16px 0 0" color={soldCases ? theme.greyScale25 : theme.black}>
            {!menuDetail?.main ? `[????????????] ${menuDetail?.name}` : `${menuName} / ${menuDetail?.name}`}
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
            {discount > 0 && (
              <TextH5B color={soldCases ? theme.greyScale25 : theme.brandColor} padding={'0 4px 0 0'}>
                {discount}%
              </TextH5B>
            )}
            <TextH5B color={soldCases ? theme.greyScale25 : theme.black}>
              {getFormatPrice(String(discountedPrice))}???
            </TextH5B>
          </PriceWrapper>
          <InfoContainer>
            <FlexCol>
              {!defaultStatus ? <InfoMessage message={checkMenuStatus()} /> : <div />}
              {!soldCases && isValidHoliday && holiday ? (
                <InfoMessage message={`${getHolidayByMenu(holiday!)} ????????? ???????????????`} />
              ) : (
                <div />
              )}
            </FlexCol>
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
