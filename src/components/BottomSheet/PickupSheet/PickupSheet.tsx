import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding, theme, bottomSheetButton } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton, Button } from '@components/Shared/Button';

const PICK_UP_PLACE = [
  { id: 1, name: '1506호 사무실 문 앞' },
  { id: 2, name: '1506호 사무실 문 옆' },
];

const PickupSheet = () => {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<number>(1);

  const changeRadioHandler = (id: number) => {
    setSelectedPickupPlace(id);
  };

  const submitHandler = () => {};

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          픽업 장소 선택
        </TextH5B>
        {PICK_UP_PLACE.map((place, index) => {
          return (
            <PickWrapper key={index}>
              <RadioButton
                onChange={() => changeRadioHandler(place.id)}
                isSelected={selectedPickupPlace === place.id}
              />
              <TextH5B padding="0 0 0 8px">{place.name}</TextH5B>
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
