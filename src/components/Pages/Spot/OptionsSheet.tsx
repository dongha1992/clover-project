import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { getSpotRegisterationsOption } from '@api/spot';
import { ISpotRegisterationsOpstions, IParamsSpotRegisterationsOptios } from '@model/index';

interface IProps {
  tab: string;
}

const OptionsSheet = ({ tab }: IProps): ReactElement => {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<number>(1);
  const [options, setOptions] = useState<ISpotRegisterationsOpstions>();

  const router = useRouter();
  const { type } = router.query;

  const changeRadioHandler = (id: number) => {
    setSelectedPickupPlace(id);
  };

  const onChangeTest = (e) => {
    console.log(e.target.value);
  };
  const selectTab = () => {
    if (tab === 'pickUp') {
      return options?.pickupLocationTypeOptions;
    } else if (tab === 'time') {
      return options?.lunchTimeOptions;
    } else if (tab === 'place' && type === 'private') {
      return options?.placeTypeOptions;
    } else if (tab === 'place') {
      return options?.placeTypeOptions;
    }
  };

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
    const typeUpperCase = () => {
      switch(type){
        case 'private':
          return 'PRIVATE';
        case 'owner':
          return 'OWNER';
        case 'public':
          return 'PUBLIC';
        default:
          return null;
      };
    };
    
    const getRegisterationsOption = async() => {
      const params: IParamsSpotRegisterationsOptios = {
        type: typeUpperCase(),
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


  console.log('options', options);
  // const seletedTime = PICK_UP_PLACE.find((item)=> item.id === Number(selectedPickupPlace))?.name;

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {titleType()}
        </TextH5B>
        <SelectWrapper>
          {selectTab()?.map((items, idx) => {
            return (
              <Selected key={idx}>
                <RadioButton
                  onChange={(e) => onChangeTest(e)}
                  // isSelected={selectedPickupPlace === items.value}
                />
                <TextH5B padding="0 0 0 8px">{items.name}</TextH5B>
              </Selected>
            );
          })}
        </SelectWrapper>
      </Wrapper>
      <ButtonContainer onClick={() => {}}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
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
