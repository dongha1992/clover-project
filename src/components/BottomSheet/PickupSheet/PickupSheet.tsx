import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding, bottomSheetButton } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { SET_SPOT_PICKUP_PLACE } from '@store/spot';

const PickupSheet = ({pickupInfo}: any) => {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<number>(pickupInfo[0]?.spotId);
  const dispatch = useDispatch();
  const changeRadioHandler = (id: number) => {
    setSelectedPickupPlace(id);
  };

  const selectedPickup = pickupInfo.find((i: any) => i.spotId === selectedPickupPlace);

  const submitHandler = () => {
    dispatch(SET_SPOT_PICKUP_PLACE(selectedPickup.name));
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          픽업 장소 선택
        </TextH5B>
        {pickupInfo?.map((i: any, index: number) => {
          return (
            <PickWrapper key={index}>
              <RadioButton
                onChange={() => changeRadioHandler(i.spotId)}
                isSelected={selectedPickupPlace === i.spotId}
              />
              <TextH5B padding="0 0 0 8px">{i.name}</TextH5B>
            </PickWrapper>
          );
        })}
      </Wrapper>
      <ButtonContainer onClick={() => submitHandler()}>
        <Button height="100%" width="100%" borderRadius="0">
          선택하기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(PickupSheet);
