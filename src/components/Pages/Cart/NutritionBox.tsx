import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import { FlexBetween, FlexStart, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';

interface IProps {
  nutritionObj: { calorie: number; protein: number };
}

const NutritionBox = ({ nutritionObj }: IProps) => {
  return (
    <InfoWrapper>
      <BorderLine height={1} margin="16px 0" />
      <FlexStart>
        <Calorie>
          <TextH7B padding="0 8px 0 0" color={theme.greyScale45}>
            총 열량
          </TextH7B>
          <TextH4B padding="0 2px 0 0">{nutritionObj.calorie}</TextH4B>
          <TextB3R>Kcal</TextB3R>
        </Calorie>
        <Protein>
          <TextH7B padding="0 8px 0 0" color={theme.greyScale45}>
            총 단백질
          </TextH7B>
          <TextH4B padding="0 2px 0 0">{nutritionObj.protein}</TextH4B>
          <TextB3R>g</TextB3R>
        </Protein>
      </FlexStart>
    </InfoWrapper>
  );
};

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Calorie = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`;
const Protein = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`;

export default React.memo(NutritionBox);
