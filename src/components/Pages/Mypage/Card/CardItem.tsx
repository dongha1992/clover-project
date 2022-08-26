import React from 'react';
import styled from 'styled-components';
import { FlexBetweenStart, FlexRowStart, FlexRow, FlexCol, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { IGetCard } from '@model/index';

interface IProps {
  onClick: (card: IGetCard) => void;
  card?: IGetCard;
  cardCount?: number;
  isFromOrder?: boolean;
  isMypage?: boolean;
}

const CardItem = ({ onClick, card, cardCount, isFromOrder, isMypage }: IProps) => {
  const buttonTitle = () => {
    switch (true) {
      case isFromOrder && isMypage:
        return '선택';
      case isFromOrder:
        return '변경하기';
      default:
        return '수정';
    }
  };
  return (
    <RegisteredCardWrapper>
      <FlexBetweenStart>
        <FlexRowStart>
          <SVGIcon name="card" />
          <FlexCol padding="0 0 0px 8px">
            <FlexRow padding="0 0 8px 0">
              <TextH5B padding="0 4px 0 0">{card?.name || ''}</TextH5B>
              {card?.main ? <Tag>대표카드</Tag> : null}
              {card?.isUsing && <Tag margin="0 0 0 4px">정기결제 중</Tag>}
            </FlexRow>
          </FlexCol>
        </FlexRowStart>
        <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={() => onClick(card!)} pointer>
          {buttonTitle()}
        </TextH6B>
      </FlexBetweenStart>
    </RegisteredCardWrapper>
  );
};

const RegisteredCardWrapper = styled.div``;

export default React.memo(CardItem);
