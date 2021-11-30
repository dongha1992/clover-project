import React from 'react';
import { TextH5B, TextB2R } from '@components/Text';
import styled from 'styled-components';
import { theme, FlexRow } from '@styles/theme';
import Checkbox from '@components/Checkbox';

type TProps = {
  data: any;
  changeHandler: (id: number) => void;
  selectedCheckboxIds: number[];
};

function MultipleFilter({ data, changeHandler, selectedCheckboxIds }: TProps) {
  return (
    <Container>
      <BtnContainer>
        {data &&
          data.map((item: any, index: number) => {
            const isSelected = selectedCheckboxIds.includes(item.id);
            return (
              <FlexRow key={index}>
                <Checkbox
                  isSelected={isSelected}
                  onChange={() => changeHandler(item.id)}
                  key={index}
                />
                {isSelected ? (
                  <TextH5B padding="4px 0 0 8px">{item.text}</TextH5B>
                ) : (
                  <TextB2R padding="4px 0 0 8px">{item.text}</TextB2R>
                )}
              </FlexRow>
            );
          })}
      </BtnContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BtnContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`;

export default React.memo(MultipleFilter);
