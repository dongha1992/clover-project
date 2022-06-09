import React, { useState, useEffect } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/Shared/BorderLine';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { MUTILPLE_CHECKBOX_MENU, RADIO_CHECKBOX_MENU } from '@constants/filter';
import { theme, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { menuSelector } from '@store/menu';
import { filterSelector, SET_CATEGORY_FILTER } from '@store/filter';
import { useDispatch, useSelector } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

/* TODO : 전체선택 시  */

const MenuFilter = () => {
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>([]);
  const [selectedRadioId, setSelectedRadioId] = useState<string>('');

  const dispatch = useDispatch();
  const {
    categoryFilters: { order, filter },
  } = useSelector(filterSelector);

  const checkboxHandler = (name: string) => {
    const findItem = selectedCheckboxIds.find((_name) => _name === name);
    let tempSelectedCheckboxIds = selectedCheckboxIds.slice();

    if (name === '전체') {
      setSelectedCheckboxIds(['전체']);
      return;
    }

    if (findItem) {
      tempSelectedCheckboxIds = tempSelectedCheckboxIds.filter((_name) => _name !== name);
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

  const submitHandler = () => {
    const menufilterMap: Obj = {
      전체: '',
      비건: 'VEGAN',
      해산물: 'SEAFOOD',
      육류: 'MEAT',
      유제품: 'DAIRY_PRODUCTS',
    };
    const getValueByMultipleFilter = selectedCheckboxIds.map((item) => {
      return menufilterMap[item];
    });

    dispatch(SET_CATEGORY_FILTER({ filter: getValueByMultipleFilter, order: selectedRadioId }));
    dispatch(INIT_BOTTOM_SHEET());
  };

  useEffect(() => {
    const selectedCheckBox = MUTILPLE_CHECKBOX_MENU.filter((item) => filter.includes(item.value)).map(
      (item) => item.name
    );
    const hasSelectCheckBox = selectedCheckBox.length > 0;

    setSelectedRadioId(order || '');
    setSelectedCheckboxIds(hasSelectCheckBox ? selectedCheckBox : ['전체']);
  }, []);

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
