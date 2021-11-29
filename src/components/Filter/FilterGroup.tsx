import React, { useState } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/BorderLine';
import { TextH5B } from '@components/Text';
import styled from 'styled-components';
import {
  MUTILPLE_CHECKBOX,
  RADIO_CHECKBOX,
  MUTILPLE_CHECKBOX_SPOT,
  RADIO_CHECKBOX_SPOT,
} from '@constants/filter';

/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

interface IFilterGroup {
  isSpot?: boolean;
}

function FilterGroup({ isSpot }: IFilterGroup) {
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<number[]>([1]);
  const [selectedRadioId, setSelectedRadioId] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const checkboxHandler = (id: number) => {
    /* TODO filter 왜 그래.. */
    /* TODO 로직 넘 복잡 */
    const findItem = selectedCheckboxIds.find((_id) => _id === id);
    const tempSelectedCheckboxIds = selectedCheckboxIds.slice();

    if (id === 1) {
      setSelectedCheckboxIds([1]);
      return;
    }

    if (findItem) {
      tempSelectedCheckboxIds.filter((_id) => _id !== id);
    } else {
      const allCheckedIdx = tempSelectedCheckboxIds.indexOf(1);

      if (allCheckedIdx !== -1) {
        tempSelectedCheckboxIds.splice(allCheckedIdx, 1);
      }
      tempSelectedCheckboxIds.push(id);
    }
    setSelectedCheckboxIds(tempSelectedCheckboxIds);
  };

  const radioButtonHandler = (id: number) => {
    setSelectedRadioId(id);
  };

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        필터 및 정렬
      </TextH5B>
      <Wrapper>
        <MultipleFilter
          title="필터 (중복 선택 가능)"
          data={MUTILPLE_CHECKBOX}
          changeHandler={checkboxHandler}
          selectedCheckboxIds={selectedCheckboxIds}
        />
        <BorderLine height={1} margin="16px 0" />
        <OrderFilter
          title="정렬"
          data={RADIO_CHECKBOX}
          changeHandler={radioButtonHandler}
          selectedRadioId={selectedRadioId}
        />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin-bottom: 32px;
`;
const Wrapper = styled.div`
  padding-left: 24px;
`;

export default React.memo(FilterGroup);
