import React, { useState, useCallback, useEffect } from 'react';
import { SpotMultipleFilter, OrderFilter } from '@components/Filter/components';
import BorderLine from '@components/Shared/BorderLine';
import { TextH4B, TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { RADIO_CHECKBOX_SPOT } from '@constants/filter';
import { theme, bottomSheetButton } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { useQuery } from 'react-query';
import { getSpotsFilter } from '@api/spot';
import { useDispatch, useSelector } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import {
  spotSelector,
  SET_SPOT_SEARCH_SELECTED_FILTERS,
  INIT_SEARCH_SELECTED_FILTERS,
  SET_SPOT_SEARCH_SORT,
} from '@store/spot';
import { destinationForm } from '@store/destination';

interface IProps {
  getLocation?: any;
}

const SpotSearchFilter = ({ getLocation }: IProps) => {
  const dispatch = useDispatch();
  const { spotSearchSelectedFilters, spotSearchSort, spotsPosition } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>(spotSearchSelectedFilters);
  const defaultRedioId = () => {
    if (userLocationLen) {
      return setSelectedRadioId('nearest');
    } else if (!userLocationLen) {
      return setSelectedRadioId('frequency');
    }
  };
  const [selectedRadioId, setSelectedRadioId] = useState<string>(spotSearchSort);
  const userLocationLen = userLocation.emdNm?.length! > 0;

  // 필터 api
  const { data: spotsFilter } = useQuery(['spotFilter'], async () => {
    const response = await getSpotsFilter();
    return response.data.data;
  });

  const checkboxHandler = useCallback(
    (name: string, isSelected: boolean | undefined) => {
      const findItem = selectedCheckboxIds.find((_name) => _name === name);

      if (!isSelected) {
        setSelectedCheckboxIds([...selectedCheckboxIds, name]);
      } else if (isSelected && findItem) {
        const filters = selectedCheckboxIds.filter((_name) => _name !== name);
        setSelectedCheckboxIds([...filters]);
      }
    },
    [selectedCheckboxIds]
  );

  const radioButtonHandler = (value: string) => {
    setSelectedRadioId(value);
  };

  const initSpotFilterHandler = () => {
    setSelectedCheckboxIds([]);
    defaultRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
  };

  const onClick = () => {
    if (selectedRadioId === 'nearest' && !userLocationLen) {
      getLocation();
      clickButtonHandler();
    } else {
      clickButtonHandler();
    }
  };

  const clickButtonHandler = () => {
    dispatch(SET_SPOT_SEARCH_SELECTED_FILTERS(selectedCheckboxIds));
    dispatch(SET_SPOT_SEARCH_SORT(selectedRadioId));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center pointer>
        정렬 및 필터
      </TextH5B>
      <Wrapper>
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          정렬
        </TextH5B>
        <OrderFilter
          data={RADIO_CHECKBOX_SPOT}
          changeHandler={radioButtonHandler}
          selectedRadioValue={selectedRadioId}
          defaultData={userLocationLen ? 'nearest' : 'frequency'}
        />
        <BorderLine height={1} margin="16px 0" />
        <TextH5B padding={'0 0 8px 0'} color={theme.greyScale65}>
          필터
        </TextH5B>
        <SpotMultipleFilter
          data={spotsFilter?.filters!}
          changeHandler={checkboxHandler}
          selectedCheckboxIds={selectedCheckboxIds}
        />
      </Wrapper>
      <ButtonContainer>
        <Button height="100%" width="100%" borderRadius="0" onClick={initSpotFilterHandler}>
          전체 초기화
        </Button>
        <Col />
        <Button height="100%" width="100%" borderRadius="0" onClick={onClick}>
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
