import React, { useState } from 'react';
import { MultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/Shared/BorderLine';
import { TextB3R, TextH4B } from '@components/Shared/Text';
import styled from 'styled-components';
import { RADIO_CHECKBOX_SPOT } from '@constants/filter';
import { theme, FlexCol, FlexBetween, bottomSheetButton } from '@styles/theme';
import { ToggleButton, Button } from '@components/Shared/Button';
import { useQuery } from 'react-query';
import { getSpotsFilter } from '@api/spot';
import { useDispatch, useSelector } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_SPOTS_FILTERED, spotSelector, INIT_SPOT_FILTERED } from '@store/spot';
import { destinationForm } from '@store/destination';


const SpotSearchFilter = () => {
  const dispatch = useDispatch();
  const { spotsSearchResultFiltered } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);

  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>([]);
  const [selectedRadioId, setSelectedRadioId] = useState<string>('');

  const userLocationLen = !!userLocation.emdNm?.length;
  const { data: spotsFilter } = useQuery(['spotList', 'station'], async () => {
    const response = await getSpotsFilter();
    return response.data.data;
  });
// console.log(selectedRadioId, selectedCheckboxIds);
  const checkboxHandler = (id: string) => {
    const findItem = selectedCheckboxIds.find((_id) => _id === id);
    const tempSelectedCheckboxIds = selectedCheckboxIds.slice();

    if (id === '') {
      setSelectedCheckboxIds(['']);
      return;
    }

    if (findItem) {
      tempSelectedCheckboxIds.filter((_id) => _id !== id);
    } else {
      const allCheckedIdx = tempSelectedCheckboxIds.indexOf('');
      if (allCheckedIdx !== -1) {
        tempSelectedCheckboxIds.splice(allCheckedIdx, 1);
      }
      tempSelectedCheckboxIds.push(id);
    }
    setSelectedCheckboxIds(tempSelectedCheckboxIds);
  };

  const radioButtonHandler = (value: string) => {
    setSelectedRadioId(value);
  };


  const initSpotFilterHandler = () => {
    setSelectedCheckboxIds(['']);
    dispatch(INIT_SPOT_FILTERED());
  };

  const clickButtonHandler = () => {
    dispatch(
      SET_SPOTS_FILTERED({
        ...spotsSearchResultFiltered,
        sort: selectedRadioId,
      })
    );
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TextH4B padding="24px 0 16px 0" center>
        필터 및 정렬
      </TextH4B>
      <Wrapper>
        <TextH4B padding={'0 0 8px 0'} color={theme.greyScale65}>
          정렬
        </TextH4B>
        <OrderFilter
          data={RADIO_CHECKBOX_SPOT}
          changeHandler={radioButtonHandler}
          selectedRadioValue={selectedRadioId}
          defaultData={userLocationLen? 'nearest': 'frequency'}
        />
        <BorderLine height={1} margin="16px 0" />
        <TextH4B padding={'0 0 8px 0'} color={theme.greyScale65}>
          필터
        </TextH4B>
        <MultipleFilter
          etcFilter
          data={spotsFilter?.filters}
          changeHandler={checkboxHandler}
          selectedCheckboxIds={selectedCheckboxIds}
        />
      </Wrapper>
      <ButtonContainer>
        <Button height="100%" width="100%" borderRadius="0" onClick={initSpotFilterHandler}>
          전체 초기화
        </Button>
        <Col />
        <Button height="100%" width="100%" borderRadius="0" onClick={clickButtonHandler}>
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

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export default React.memo(SpotSearchFilter);
