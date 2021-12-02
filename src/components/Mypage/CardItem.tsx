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
import { TextH5B, TextB3R, TextH6B } from '@components/Text';
import Tag from '@components/Tag';

function CardItem({ onClick }: any) {
  return (
    <RegisteredCardWrapper>
      <FlexBetweenStart>
        <FlexRowStart>
          <SVGIcon name="card" />
          <FlexCol padding="0 0 0px 8px">
            <FlexRow padding="0 0 8px 0">
              <TextH5B padding="0 4px 0 0">카드이름</TextH5B>
              <Tag margin="0">대표카드</Tag>
            </FlexRow>
            <TextB3R color={theme.greyScale65}>우리 가득한 어쩌구 12</TextB3R>
          </FlexCol>
        </FlexRowStart>
        <TextH6B
          color={theme.greyScale65}
          textDecoration="underline"
          onClick={onClick}
        >
          변경하기
        </TextH6B>
      </FlexBetweenStart>
    </RegisteredCardWrapper>
  );
}

const RegisteredCardWrapper = styled.div`
  padding-bottom: 24px;
`;

export default React.memo(CardItem);
