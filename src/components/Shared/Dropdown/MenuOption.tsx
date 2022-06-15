import React from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';

type TProps = {
  option: any;
  selectMenuHandler: any;
  menuId: number;
};

const MenuOption = ({ option, selectMenuHandler, menuId }: TProps) => {
  const getMenuOptionPrice = () => {
    const price = option.price;
    const discount = Math.floor((option.discountPrice / option.price) * 100);
    const discountedPrice = option.price - option.discountPrice;
    return { price, discount, discountedPrice };
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
        {option.isSold ? <TextH7B color={theme.greyScale25}>품절</TextH7B> : <TextH7B>{option.limit}</TextH7B>}
      </FlexBetween>
      <FlexRowStart padding="0 0 4px 0">
        <TextH7B color={theme.brandColor}>{option.badge}</TextH7B>
      </FlexRowStart>
      <FlexRow>
        <TextH6B color={!option.isSold ? theme.brandColor : theme.greyScale25}>
          {getMenuOptionPrice().discount}%
        </TextH6B>
        <TextH6B padding="0 4px">{getMenuOptionPrice().discountedPrice}원</TextH6B>
        <TextH6B color={theme.greyScale25} textDecoration="line-through">
          {getMenuOptionPrice().price}원
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
    console.log(isSold);
    if (isSold) {
      return css`
        color: ${theme.greyScale25};
      `;
    } else {
      return css``;
    }
  }}
  :hover {
    background-color: #d9d9d9;
  }
`;

export default React.memo(MenuOption);
