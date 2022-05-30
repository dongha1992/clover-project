import React from 'react';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import styled from 'styled-components';
import { theme, FlexRow } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { IFilters } from '@model/index';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';

interface IProps {
  data: IFilters[];
  changeHandler: (id: string, isSelected?: boolean) => void;
  selectedCheckboxIds: string[];
  spotFilter?: boolean;
}

const MultipleFilter = ({ data, changeHandler, selectedCheckboxIds, spotFilter, }: IProps) => {
  const { spotsSearchResultFiltered } = useSelector(spotSelector);

  return (
    <Container>
      <BtnContainer>
        {data &&
          data?.map((item, index) => {
            const isSelected = spotFilter
              ? selectedCheckboxIds.includes(item.fieldName)
              : selectedCheckboxIds.includes(item.name);
            const onCheck = (value: string) => {
              changeHandler(value, isSelected);
            };

            return (
              <FlexRow key={index}>
                {spotFilter ? (
                  <Checkbox isSelected={isSelected} onChange={() => onCheck(item.fieldName)} key={index} />
                ) : (
                  <Checkbox isSelected={isSelected} onChange={() => changeHandler(item.name)} key={index} />
                )}
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
