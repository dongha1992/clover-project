import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH5B, TextH7B } from '@components/Shared/Text';

type TProps = {
  day: number;
  handler: (date: number) => void;
  selectedDay: boolean;
  index: number;
  disabledDates: number[];
};

function Days({ day, handler, selectedDay, index, disabledDates }: TProps) {
  const isSecondWeeeks = index > 5;
  const isToday = !index;

  const dayColorRender = () => {
    switch (true) {
      case disabledDates.includes(day): {
        return 'greyScale25';
      }
      case selectedDay: {
        return 'white';
      }
      default: {
        return 'black';
      }
    }
  };

  return (
    <Container onClick={() => handler(index)} isSecondWeeeks={isSecondWeeeks}>
      <Wrapper selectedDay={selectedDay}>
        <TextH5B color={`${theme[dayColorRender()]}`}>{day}</TextH5B>
      </Wrapper>
      <TextWrapper>
        {isToday ? (
          <TextH7B color={theme.greyScale45} padding="4px 0 0 0">
            오늘
          </TextH7B>
        ) : (
          ''
        )}
      </TextWrapper>
    </Container>
  );
}

const Container = styled.div<{ isSecondWeeeks?: boolean }>`
  width: calc(100% / 6);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  margin-bottom: ${({ isSecondWeeeks }) => (isSecondWeeeks ? 0 : 12)}px;
`;

const Wrapper = styled.div<{ selectedDay?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ selectedDay }) =>
    selectedDay ? theme.brandColor : ''};
  padding: 4px;
  > div {
    padding-top: 4px;
  }
`;

const TextWrapper = styled.div`
  height: 16px;
`;

export default Days;
