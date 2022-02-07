import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { getSpotRegisterationsOption } from '@api/spot';
import { ISpotRegisterationsOpstions, IParamsSpotRegisterationsOptios } from '@model/index';
import { SET_SPOT_REGISTRATIONS_OPTIONS, spotSelector } from '@store/spot';
import { useSelector, useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

interface IProps {
  tab: string;
}

const OptionsSheet = ({ tab }: IProps): ReactElement => {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<string>('');
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>('');
  const [selectedLunchTime, setSelectedLunchTime] = useState<string>('');
  const [options, setOptions] = useState<ISpotRegisterationsOpstions>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { type } = router.query;
  const { spotsRegistrationOptions } = useSelector(spotSelector);

  const selectTab = () => {
    if (tab === 'pickUp') {
      return {options: options?.pickupLocationTypeOptions, value: selectedPickupPlace};
    } else if (tab === 'time') {
      return {options: options?.lunchTimeOptions, value: selectedLunchTime};
    } else if (tab === 'place' && type === 'private') {
      return {options: options?.placeTypeOptions, value: selectedPlaceType};
    } else if (tab === 'place') {
      return {options: options?.placeTypeOptions, value: selectedPlaceType};
    }
  };

  const pickupTypeObj = selectTab()?.options?.find((i: any) => i.value === selectedPickupPlace);
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
  useEffect(()=> {    
    const getRegisterationsOption = async() => {
      const params: IParamsSpotRegisterationsOptios = {
        type: type?.toString().toUpperCase(),
      };
      try{
        const { data } = await getSpotRegisterationsOption(params);
        if(data.code === 200){
          setOptions(data.data);
        };
      }catch(err){
        console.error(err);
      };
    };
    getRegisterationsOption();
  }, []);

  const registrationsOptionsHandler = useCallback((value: string) => {
      if(tab === 'pickUp'){
        setSelectedPickupPlace(value);
      }else if(tab === 'time'){
        setSelectedLunchTime(value);
      }else if(tab === 'place'){
        setSelectedPlaceType(value);
      };
    },[]);

  const selectedHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
    // 픽업장소
    if(tab === 'pickUp'){
      const selectedOptions = {
        pickupLocationTypeOptions: pickupTypeObj,
        placeTypeOptions: spotsRegistrationOptions.placeTypeOptions,
        lunchTimeOptions: spotsRegistrationOptions.lunchTimeOptions,
      };
      dispatch(SET_SPOT_REGISTRATIONS_OPTIONS(selectedOptions));
    }
    // 점심시간
    else if(tab === 'time'){
      const selectedOptions = {
        pickupLocationTypeOptions: spotsRegistrationOptions.pickupLocationTypeOptions,
        placeTypeOptions: spotsRegistrationOptions.placeTypeOptions,
        lunchTimeOptions: lunchTimeTypeObj,
      };
      dispatch(SET_SPOT_REGISTRATIONS_OPTIONS(selectedOptions));
    // 장소 종류
    }else if(tab === 'place'){
      const selectedOptions = {
        pickupLocationTypeOptions: spotsRegistrationOptions.pickupLocationTypeOptions,
        placeTypeOptions: placeTypeObj,
        lunchTimeOptions: spotsRegistrationOptions.lunchTimeOptions,
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
                <TextH5B padding="0 0 0 8px">{items.name}</TextH5B>
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
