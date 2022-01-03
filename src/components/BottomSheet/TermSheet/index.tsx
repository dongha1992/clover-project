import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import { TextB2R, TextH5B } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button/RadioButton';

const DATE = [
  { id: 1, name: '2021-12-09' },
  { id: 2, name: '2021-11-11' },
];

const TermSheet = ({ title }: any) => {
  const [selectedDate, setSelectedDate] = useState<number>(1);

  const changeRadioHandler = (id: number) => {
    setSelectedDate(id);
  };
  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {title}
        </TextH5B>
        {DATE.map((date, index) => {
          const isSelected = selectedDate === date.id;
          return (
            <PickWrapper key={index}>
              <RadioButton
                onChange={() => changeRadioHandler(date.id)}
                isSelected={isSelected}
              />
              {isSelected ? (
                <TextH5B padding="0 0 0 8px">{date.name}</TextH5B>
              ) : (
                <TextB2R padding="0 0 0 8px">{date.name}</TextB2R>
              )}
            </PickWrapper>
          );
        })}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export default TermSheet;
