import React from 'react';
import { TextB2R } from '@components/Shared/Text';
import styled from 'styled-components';
import { FlexRow } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { IFilters } from '@model/index';

interface IProps {
  data: IFilters[];
  changeHandler: (id: string, isSelected?: boolean) => void;
  selectedCheckboxIds: string[];
}

const MultipleFilter = ({ data, changeHandler, selectedCheckboxIds }: IProps) => {

  return (
    <Container>
      <BtnContainer>
        {data &&
          data?.map((item, index) => {
            const isSelected = selectedCheckboxIds.includes(item.name);
            const onCheck = (value: string) => {
              changeHandler(value, isSelected);
            };
            return (
              <FlexRow key={index}>
                <Checkbox isSelected={isSelected} onChange={() => onCheck(item.name)} key={index} />
                <TextB2R padding="4px 0 0 8px" onClick={() => onCheck(item.name)} pointer>{item.name}</TextB2R>
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
