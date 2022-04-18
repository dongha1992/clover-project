import React, { useState } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/Shared/BorderLine';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { MUTILPLE_CHECKBOX_MENU, RADIO_CHECKBOX_MENU } from '@constants/filter';
import { theme, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

/* TODO : 전체선택 시  */

const MenuFilter = () => {
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>([]);
  const [selectedRadioId, setSelectedRadioId] = useState<string>('');
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const checkboxHandler = (name: string) => {
    /* TODO filter 왜 그래.. */
    /* TODO 로직 넘 복잡 */
    const findItem = selectedCheckboxIds.find((_name) => _name === name);
    const tempSelectedCheckboxIds = selectedCheckboxIds.slice();

    if (name === '전체') {
      setSelectedCheckboxIds(['전체']);
      return;
    }

    if (findItem) {
      tempSelectedCheckboxIds.filter((_name) => _name !== name);
    } else {
      const allCheckedIdx = tempSelectedCheckboxIds.indexOf('전체');

      if (allCheckedIdx !== -1) {
        tempSelectedCheckboxIds.splice(allCheckedIdx, 1);
      }
      tempSelectedCheckboxIds.push(name);
    }
    setSelectedCheckboxIds(tempSelectedCheckboxIds);
  };

  const radioButtonHandler = (value: string) => {
    setSelectedRadioId(value);
  };

  const changeToggleHandler = () => {};
  const submitHandler = () => {};

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
          selectedRadioValue={selectedRadioId}
        />
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          적용하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 32px;
`;
const Wrapper = styled.div`
  padding-left: 24px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(MenuFilter);
