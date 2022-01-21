import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { TextH5B, TextH7B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';

type TProps = {
  day: number;
  value: string;
  handler: (date: string) => void;
  selectedDay: boolean;
  index: number;
  disabledDates: string[];
  otherDeliveryDate?: string[] | [];
};

const Days = ({
  day,
  value,
  handler,
  selectedDay,
  index,
  disabledDates,
  otherDeliveryDate,
}: TProps) => {
  const isSecondWeeeks = index > 5;
  const isToday = !index;
  const hasOtherDeliveryDate =
    otherDeliveryDate && otherDeliveryDate[0] === value;
  const disabledDate = disabledDates.includes(value);

  const dayColorRender = () => {
    switch (true) {
      case disabledDate: {
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

  const extraTextRender = () => {
    switch (true) {
      case isToday: {
        return (
          <TextH7B color={theme.greyScale45} padding="4px 0 0 0">
            오늘
          </TextH7B>
        );
      }
      case hasOtherDeliveryDate: {
        return <SVGIcon name="brandColorDot" />;
      }
      default:
        '';
    }
  };

  return (
    <Container
      onClick={() => {
        if (disabledDate) {
          return;
        } else {
          handler(value);
        }
      }}
      isSecondWeeeks={isSecondWeeeks}
    >
      <Wrapper
        selectedDay={selectedDay}
        hasOtherDeliveryDate={hasOtherDeliveryDate}
      >
        <TextH5B color={`${theme[dayColorRender()]}`}>{day}</TextH5B>
      </Wrapper>
      <TextWrapper>{extraTextRender()}</TextWrapper>
    </Container>
  );
};

const Container = styled.div<{ isSecondWeeeks?: boolean }>`
  width: calc(100% / 6);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  margin-bottom: ${({ isSecondWeeeks }) => (isSecondWeeeks ? 0 : 12)}px;
`;

const Wrapper = styled.div<{
  selectedDay?: boolean;
  hasOtherDeliveryDate?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: ${({ hasOtherDeliveryDate }) =>
    hasOtherDeliveryDate ? `1px dashed #35ad73` : ''};
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

export default React.memo(Days);
