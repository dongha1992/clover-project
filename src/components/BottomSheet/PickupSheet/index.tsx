import React, { useState } from 'react';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button/RadioButton';

const PICK_UP_PLACE = [
  { id: 1, name: '1506호 사무실 문 앞' },
  { id: 2, name: '1506호 사무실 문 옆' },
];

function PickupSheet() {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<number>(1);

  const changeRadioHandler = (id: number) => {
    setSelectedPickupPlace(id);
  };

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
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;
const PickWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;
export default React.memo(PickupSheet);
