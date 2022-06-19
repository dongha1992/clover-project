import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { getSpotRegisterationsOption } from '@api/spot';
import { IParamsSpotRegisterationsOptios,  } from '@model/index';
import { SET_SPOT_REGISTRATIONS_OPTIONS, spotSelector } from '@store/spot';
import { useSelector, useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useQuery } from 'react-query';

interface IProps {
  tab: string;
}

const OptionsSheet = ({ tab }: IProps): ReactElement => {
  const { spotsRegistrationOptions } = useSelector(spotSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<string>(spotsRegistrationOptions.pickupLocationTypeOptions?.value);
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>(spotsRegistrationOptions.placeTypeOptions?.value);
  const [selectedLunchTime, setSelectedLunchTime] = useState<string>(spotsRegistrationOptions.lunchTimeOptions?.value);

  const  { data : registrationsOptions } = useQuery(
    ['options'],
    async () => {
      const params: IParamsSpotRegisterationsOptios = {
        type: type?.toString().toUpperCase(),
      };
      const res = await getSpotRegisterationsOption(params);
      return res.data.data;
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );
 
  const selectTab = () => {
    if (tab === 'time') {
      return {options: registrationsOptions?.lunchTimeOptions, value: selectedLunchTime};
    } else if (tab === 'place' && type === 'PRIVATE') {
      return {options: registrationsOptions?.placeTypeOptions, value: selectedPlaceType};
    } else if (tab === 'place') {
      return {options: registrationsOptions?.placeTypeOptions, value: selectedPlaceType};
    }
  };

  const placeTypeObj = selectTab()?.options?.find((i: any) => i.value === selectedPlaceType);
  const lunchTimeTypeObj = selectTab()?.options?.find((i: any) => i.value === selectedLunchTime);

  const titleType = (): string | null => {
    switch(tab){
      case 'place':
        return '장소 종류';
      case 'time':
        return '점심시간';
      case 'pickUp':
        return '픽업 장소';
      default:
        return null;
    };
  };

  const registrationsOptionsHandler = (value: string) => {
    if(tab === 'pickUp'){
      setSelectedPickupPlace(value);
    }else if(tab === 'time'){
      setSelectedLunchTime(value);
    }else if(tab === 'place'){
      setSelectedPlaceType(value);
    };
  };

  const selectedHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
    // 점심시간
    if(tab === 'time'){
      const selectedOptions = {
        ...spotsRegistrationOptions,
        lunchTimeOptions: lunchTimeTypeObj,
      };
      dispatch(SET_SPOT_REGISTRATIONS_OPTIONS(selectedOptions));
    // 장소 종류
    }else if(tab === 'place'){
      const selectedOptions = {
        ...spotsRegistrationOptions,
        placeTypeOptions: placeTypeObj,
      };
      dispatch(SET_SPOT_REGISTRATIONS_OPTIONS(selectedOptions));
    };
  }

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {titleType()}
        </TextH5B>
        <SelectWrapper>
          {selectTab()?.options?.map((items, idx) => {
            return (
              <Selected key={idx}>
                <RadioButton
                  onChange={() => registrationsOptionsHandler(items.value)}
                  isSelected={items.value === selectTab()?.value}
                />
                {
                  items.value === selectTab()?.value ? (
                    <TextH5B padding="0 0 0 8px" onClick={() => registrationsOptionsHandler(items.value)}>{items.name}</TextH5B>
                  ) : (
                    <TextB2R padding="0 0 0 8px" onClick={() => registrationsOptionsHandler(items.value)}>{items.name}</TextB2R>
                  )
                }
              </Selected>
            );
          })}
        </SelectWrapper>
      </Wrapper>
      <ButtonContainer onClick={selectedHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          선택하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};
const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding}
`;

const SelectWrapper = styled.section`
  display: grid;
  grid-template-columns: 150px 150px;
  justify-content: space-around;
`;

const Selected = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default OptionsSheet;
