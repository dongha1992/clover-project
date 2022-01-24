import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';

type TProps = {
  option: any;
  selectMenuHandler: any;
};
/* TODO: 서버에서 주는 값에 따라 UI 수정 */

const MenuOption = ({ option, selectMenuHandler }: TProps) => {
  return (
    <OptionList onClick={() => selectMenuHandler(option)}>
      <FlexBetween>
        <TextB3R>{option.name}</TextB3R>
        <TextH7B>{option.limit}</TextH7B>
      </FlexBetween>
      <FlexRowStart padding="0 0 4px 0">
        <TextH7B color={theme.brandColor}>{option.badge}</TextH7B>
      </FlexRowStart>
      <FlexRow>
        <TextH6B color={theme.brandColor}>{option.discount}%</TextH6B>
        <TextH6B padding="0 4px">{option.price}원</TextH6B>
        <TextH6B color={theme.greyScale65} textDecoration="line-through">
          {option.price}원
        </TextH6B>
      </FlexRow>
    </OptionList>
  );
};

export default React.memo(MenuOption);

const OptionList = styled.li`
  display: flex;
  flex-direction: column;

  list-style-type: none;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e4e4;
  background-color: white;
  cursor: pointer;

  :hover {
    background-color: #d9d9d9;
  }
`;
