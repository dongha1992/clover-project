import React, { useState } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/Shared/BorderLine';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { MUTILPLE_CHECKBOX_MENU, RADIO_CHECKBOX_MENU } from '@constants/filter';
import { theme, FlexCol, FlexBetween } from '@styles/theme';

/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

/* TODO : 전체선택 시  */

function MenuFilter() {
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

  const changeToggleHandler = () => {};

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        필터 및 정렬
      </TextH5B>
      <Wrapper>
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          필터 (중복 선택 가능)
        </TextH5B>
        <MultipleFilter
          data={MUTILPLE_CHECKBOX_MENU}
          changeHandler={checkboxHandler}
          selectedCheckboxIds={selectedCheckboxIds}
        />
        <BorderLine height={1} margin="16px 0" />
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          정렬
        </TextH5B>
        <OrderFilter
          data={RADIO_CHECKBOX_MENU}
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

export default React.memo(MenuFilter);
