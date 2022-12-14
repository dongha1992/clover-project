import React from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';
import { getMenuOptionPrice } from '@utils/menu/getMenuDisplayPrice';
import { IMenuDetails } from '@model/index';

type TProps = {
  option: IMenuDetails;
  selectMenuHandler: any;
  menuId: number;
};

const MenuOption = ({ option, selectMenuHandler, menuId }: TProps) => {
  const { discount, discountedPrice, price } = getMenuOptionPrice(option);

  const isCheckedFontColor = () => {
    if (option.isSold || (option.availability?.availability && !option.availability?.availability)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <OptionList
      onClick={() => {
        if (option.isSold || (option.availability?.availability && !option.availability?.availability)) return;
        selectMenuHandler({ ...option, menuId });
      }}
      isSold={option.isSold}
      availability={!option.availability?.availability}
    >
      <FlexBetween>
        <TextB3R color={isCheckedFontColor() ? theme.greyScale25 : theme.black}>{option.name}</TextB3R>
        <FlexRow>
          {!option.isSold && option.availability?.availability && option.personalMaximum ? (
            <TextH7B color={theme.black}>{`구매 수량 제한 :${option.personalMaximum}개`}</TextH7B>
          ) : null}
          {option.isSold || (option.availability?.availability && !option.availability?.availability) ? (
            <TextH7B padding="0 0 0 4px" color={theme.greyScale25}>
              품절
            </TextH7B>
          ) : null}
        </FlexRow>
      </FlexBetween>
      <FlexRowStart padding="0 0 4px 0"></FlexRowStart>
      <FlexRow>
        {discount > 0 && (
          <TextH6B
            color={
              !option.isSold || (option.availability?.availability && option.availability?.availability)
                ? theme.brandColor
                : theme.greyScale25
            }
          >
            {discount}%&nbsp;
          </TextH6B>
        )}
        <TextH6B padding="0 4px 0 0" color={isCheckedFontColor() ? theme.greyScale25 : theme.black}>
          {discountedPrice.toLocaleString()}원
        </TextH6B>
        {(!option.isSold || (option.availability?.availability && option.availability?.availability)) && (
          <TextH6B color={theme.greyScale25} textDecoration="line-through">
            {price.toLocaleString()}원
          </TextH6B>
        )}
      </FlexRow>
    </OptionList>
  );
};

const OptionList = styled.li<{ isSold?: boolean; availability?: boolean }>`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
  cursor: pointer;

  ${({ isSold, availability }) => {
    if (isSold || availability) {
      return css`
        color: ${theme.greyScale25};
      `;
    } else if (!isSold || !availability) {
      return css``;
    }
  }}
  :hover {
    background-color: #d9d9d9;
  }
`;

export default React.memo(MenuOption);
