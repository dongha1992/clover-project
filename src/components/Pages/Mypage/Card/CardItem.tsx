import React from 'react';
import styled from 'styled-components';
import {
  FlexBetweenStart,
  FlexRowStart,
  FlexRow,
  FlexCol,
  theme,
} from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B, TextH6B } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';

export interface ICard {
  createdAt: string;
  id: number;
  main: boolean;
  name: string;
  type: string;
}
interface IProps {
  onClick: (card: ICard) => void;
  card: ICard;
}

const CardItem = ({ onClick, card }: IProps) => {
  return (
    <RegisteredCardWrapper>
      <FlexBetweenStart>
        <FlexRowStart>
          <SVGIcon name="card" />
          <FlexCol padding="0 0 0px 8px">
            <FlexRow padding="0 0 8px 0">
              <TextH5B padding="0 4px 0 0">{card.name}</TextH5B>
              {card.main ? <Tag>대표카드</Tag> : null}
            </FlexRow>
          </FlexCol>
        </FlexRowStart>
        <TextH6B
          color={theme.greyScale65}
          textDecoration="underline"
          onClick={() => onClick(card)}
        >
          변경하기
        </TextH6B>
      </FlexBetweenStart>
    </RegisteredCardWrapper>
  );
};

const RegisteredCardWrapper = styled.div`
  padding-bottom: 24px;
`;

export default React.memo(CardItem);
