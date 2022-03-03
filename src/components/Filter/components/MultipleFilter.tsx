import React, { useState } from 'react';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import styled from 'styled-components';
import { theme, FlexRow } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { IGetSpotFilter } from '@model/index';

interface IProps {
  data: [{
    value: string | boolean;
    filtered: boolean;
    fieldName: string;
    name: string;
  }] | undefined;
  changeHandler: (id: string) => void;
  selectedCheckboxIds: string[];
};

const MultipleFilter = ({
  data,
  changeHandler,
  selectedCheckboxIds,
}: IProps) => {
  return (
    <Container>
      <BtnContainer>
        {data &&
          data?.map((item, index) => {
            const isSelected = selectedCheckboxIds.includes(item.name);
            return (
              <FlexRow key={index}>
                <Checkbox
                  isSelected={isSelected}
                  onChange={() => changeHandler(item.name)}
                  key={index}
                />
                {isSelected ? (
                  <TextH5B padding="4px 0 0 8px">{item.name}</TextH5B>
                ) : (
                  <TextB2R padding="4px 0 0 8px">{item.name}</TextB2R>
                )}
              </FlexRow>
            );
          })}
      </BtnContainer>
    </Container>
  );
};

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
