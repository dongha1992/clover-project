import React, { useState } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/BorderLine';
import { TextB3R, TextH5B } from '@components/Text';
import styled from 'styled-components';
import {
  MUTILPLE_CHECKBOX,
  RADIO_CHECKBOX,
  MUTILPLE_CHECKBOX_SPOT,
  RADIO_CHECKBOX_SPOT,
} from '@constants/filter';
import { theme, FlexCol, FlexBetween } from '@styles/theme';
import ToggleButton from '@components/Button/ToggleButton ';

/* 

DefaultFilter : 다중 선택 필터
OrderFilter: 단일 선택 필터

*/

interface IFilterGroup {
  isSpot?: boolean;
}

/* TODO : 다른 필터에서 전체 선택 시 해제되는 거 spot은 없음 이거 로직 변경, toggle시 전체 선택 해제로 */

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

  const changeToggleHandler = () => {};

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        필터 및 정렬
      </TextH5B>
      <Wrapper>
        {isSpot ? (
          <>
            <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
              정렬
            </TextH5B>
            <OrderFilter
              data={RADIO_CHECKBOX_SPOT}
              changeHandler={radioButtonHandler}
              selectedRadioId={selectedRadioId}
            />
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween padding="0 24px 16px 0">
              <FlexCol>
                <TextH5B color={theme.greyScale65}>퍼블릭 스팟</TextH5B>
                <TextB3R color={theme.greyScale65}>
                  동네 주민 모두 이용 가능한 스팟
                </TextB3R>
              </FlexCol>
              <ToggleButton onChange={changeToggleHandler} status />
            </FlexBetween>
            <MultipleFilter
              data={MUTILPLE_CHECKBOX_SPOT.public}
              changeHandler={checkboxHandler}
              selectedCheckboxIds={selectedCheckboxIds}
            />
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween padding="0 24px 16px 0">
              <FlexCol>
                <TextH5B color={theme.greyScale65}>프라이빗 스팟</TextH5B>
                <TextB3R color={theme.greyScale65}>
                  임직원 등 특정 대상만 이용 가능한 스팟
                </TextB3R>
              </FlexCol>
              <ToggleButton onChange={changeToggleHandler} status />
            </FlexBetween>
            <BorderLine height={1} margin="0 0 16px 0" />
            <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
              기타
            </TextH5B>
            <MultipleFilter
              data={MUTILPLE_CHECKBOX_SPOT.etc}
              changeHandler={checkboxHandler}
              selectedCheckboxIds={selectedCheckboxIds}
            />
          </>
        ) : (
          <>
            <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
              필터 (중복 선택 가능)
            </TextH5B>
            <MultipleFilter
              data={MUTILPLE_CHECKBOX}
              changeHandler={checkboxHandler}
              selectedCheckboxIds={selectedCheckboxIds}
            />
            <BorderLine height={1} margin="16px 0" />
            <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
              정렬
            </TextH5B>
            <OrderFilter
              data={RADIO_CHECKBOX}
              changeHandler={radioButtonHandler}
              selectedRadioId={selectedRadioId}
            />
          </>
        )}
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
