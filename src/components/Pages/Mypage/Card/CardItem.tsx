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
  isOrder?: string;
}

const CardItem = ({ onClick, card, cardCount, isOrder }: IProps) => {
  const isFromOrder = isOrder === 'true';
  return (
    <RegisteredCardWrapper>
      <FlexBetweenStart>
        <FlexRowStart>
          <SVGIcon name="card" />
          <FlexCol padding="0 0 0px 8px">
            <FlexRow padding="0 0 8px 0">
              <TextH5B padding="0 4px 0 0">{card?.name || ''}</TextH5B>
              {card?.main ? <Tag>대표카드</Tag> : null}
            </FlexRow>
          </FlexCol>
        </FlexRowStart>

        {isFromOrder ? (
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={() => onClick(card!)}>
            선택하기
          </TextH6B>
        ) : (
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={() => onClick(card!)}>
            변경하기
          </TextH6B>
        )}

        {/* {cardCount && cardCount >= 2 && (
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={() => onClick(card!)}>
            변경하기
          </TextH6B>
        )} */}
      </FlexBetweenStart>
    </RegisteredCardWrapper>
  );
};

const RegisteredCardWrapper = styled.div``;

export default React.memo(CardItem);
