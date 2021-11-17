import React from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/BorderLine';
import { TextH5B } from '@components/Text';
import styled from 'styled-components';
import { MUTILPLE_CHECKBOX, RADIO_CHECKBOX } from '@constants/filter';
import { useDispatch } from 'react-redux';
/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

function CategoryFilterGroup() {
  const dispatch = useDispatch();
  const checkboxHandler = () => {};
  const radioButtonHandler = () => {};
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
        />
        <BorderLine height={1} margin="16px 0" />
        <OrderFilter
          title="정렬"
          data={RADIO_CHECKBOX}
          changeHandler={radioButtonHandler}
        />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;
const Wrapper = styled.div`
  padding-left: 24px;
`;

export default React.memo(CategoryFilterGroup);
