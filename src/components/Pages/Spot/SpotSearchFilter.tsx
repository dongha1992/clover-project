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

/* TODO : 다른 필터에서 전체 선택 시 해제되는 거 spot은 없음 이거 로직 변경, toggle시 전체 선택 해제로 */

const SpotSearchFilter = () => {
  const dispatch = useDispatch();
  const { spotsSearchResultFiltered } = useSelector(spotSelector);

  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>([]);
  const [selectedRadioId, setSelectedRadioId] = useState<string>('');
  const [publicToggle, setPublicToggle] = useState(false);
  const [privateToggle, setPrivateToggle] = useState(false);

  const { data: spotsFilter } = useQuery(['spotList', 'station'], async () => {
    const response = await getSpotsFilter();
    return response.data.data;
  });

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

  const changePublicToggleHandler = () => {
    setPublicToggle(!publicToggle);
  };
  const changePrivateToggleHandler = () => {
    setPrivateToggle(!privateToggle);
  };

  const initSpotFilterHandler = () => {
    setSelectedCheckboxIds(['']);
    setPublicToggle(false);
    setPrivateToggle(false);
    dispatch(INIT_SPOT_FILTERED());
  };

  const clickButtonHandler = () => {
    dispatch(
      SET_SPOTS_FILTERED({
        ...spotsSearchResultFiltered,
        public: publicToggle,
        private: privateToggle,
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
        />
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="0 24px 16px 0">
          <FlexCol>
            <TextH4B color={theme.black}>프코스팟</TextH4B>
            <TextB3R color={theme.greyScale65}>동네 주민 모두 이용 가능한 스팟</TextB3R>
          </FlexCol>
          <ToggleButton onChange={changePublicToggleHandler} status={publicToggle} />
        </FlexBetween>
        <MultipleFilter
          data={spotsFilter?.publicFilters}
          changeHandler={checkboxHandler}
          selectedCheckboxIds={selectedCheckboxIds}
        />
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="0 24px 16px 0">
          <FlexCol>
            <TextH4B color={theme.black}>프라이빗 스팟</TextH4B>
            <TextB3R color={theme.greyScale65}>임직원 등 특정 대상만 이용 가능한 스팟</TextB3R>
          </FlexCol>
          <ToggleButton onChange={changePrivateToggleHandler} status={privateToggle} />
        </FlexBetween>
        <BorderLine height={1} margin="0 0 16px 0" />
        <TextH4B padding={'0 0 8px 0'} color={theme.greyScale65}>
          기타
        </TextH4B>
        <MultipleFilter
          etcFilter
          data={spotsFilter?.etcFilters}
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
