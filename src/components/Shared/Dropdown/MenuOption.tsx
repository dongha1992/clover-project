import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';
import { getMenuOptionPrice } from '@utils/menu/getMenuDisplayPrice';
import { IMenuDetails } from '@model/index';

type TProps = {
  option: any;
  selectMenuHandler: any;
  menuId: number;
};

const MenuOption = ({ option, selectMenuHandler, menuId }: TProps) => {
  const { discount, discountedPrice, price } = getMenuOptionPrice(option);

  const messageRender = () => {
    switch (true) {
      case option.isSold: {
        return <TextH7B color={theme.greyScale25}>품절</TextH7B>;
      }
      case option.personalMaximum: {
        return <TextH7B color={theme.black}>{`구매 수량 제한 :${option.personalMaximum}개`}</TextH7B>;
      }
      default: {
        return ``;
      }
    }
  };

  return (
    <OptionList
      onClick={() => {
        if (option.isSold) return;
        selectMenuHandler({ ...option, menuId });
      }}
      isSold={option.isSold}
    >
      <FlexBetween>
        <TextB3R>{option.name}</TextB3R>
        <FlexRow>
          {option.personalMaximum && (
            <TextH7B color={theme.black}>{`구매 수량 제한 :${option.personalMaximum}개`}</TextH7B>
          )}
          {option.isSold && (
            <TextH7B padding="0 0 0 4px" color={theme.greyScale25}>
              품절
            </TextH7B>
          )}
        </FlexRow>
      </FlexBetween>
      <FlexRowStart padding="0 0 4px 0"></FlexRowStart>
      <FlexRow>
        {discount < 0 && (
          <TextH6B padding="0 0 0 4px" color={!option.isSold ? theme.brandColor : theme.greyScale25}>
            {discount}%
          </TextH6B>
        )}
        <TextH6B padding="0 4px 0 0">{discountedPrice.toLocaleString()}원</TextH6B>
        <TextH6B color={theme.greyScale25} textDecoration="line-through">
          {price.toLocaleString()}원
        </TextH6B>
      </FlexRow>
    </OptionList>
  );
};

const OptionList = styled.li<{ isSold?: boolean }>`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
  cursor: pointer;

  ${({ isSold }) => {
    if (isSold) {
      return css`
        color: ${theme.greyScale25};
      `;
    } else if (!isSold) {
      return css``;
    }
  }}
  :hover {
    background-color: #d9d9d9;
  }
`;

export default React.memo(MenuOption);
