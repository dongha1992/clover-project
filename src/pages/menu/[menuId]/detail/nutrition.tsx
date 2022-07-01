import React from 'react';
import styled from 'styled-components';
import { IProductInfo } from '@model/index';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { INutitionInfo } from '@model/index';
import { textBody3, theme } from '@styles/theme';

const NutritionInfoPage = () => {
  const { info } = useSelector(menuSelector);

  return (
    <Container>
      <Wrapper>
        {info.nutritionInfoNotis.map((nutrition: INutitionInfo, index: number) => {
          return (
            <Table key={index}>
              <TextH5B padding="0 0 18px 0">{nutrition.name}</TextH5B>
              <Row>
                <Left>영양정보</Left>
                <Right>{nutrition.nutritionInfo}</Right>
              </Row>
              <Row>
                <Left>총 내용량 당</Left>
                <Right>{nutrition.totalSugarsRatio}</Right>
              </Row>
              <Row>
                <Left>나트륨</Left>
                <Right>{nutrition.sodium}</Right>
              </Row>
              <Row>
                <Left>탄수화물</Left>
                <Right>{nutrition.carbohydrates}</Right>
              </Row>
              <Row>
                <Left>당류</Left>
                <Right>{nutrition.sugars}</Right>
              </Row>
              <Row>
                <Left>지방</Left>
                <Right>{nutrition.fat}</Right>
              </Row>
              <Row>
                <Left>트랜스지방</Left>
                <Right>{nutrition.transFat}</Right>
              </Row>
              <Row>
                <Left>포화지방</Left>
                <Right>{nutrition.saturatedFat}</Right>
              </Row>
              <Row>
                <Left>콜레스테롤</Left>
                <Right>{nutrition.cholesterol}</Right>
              </Row>
              <Row>
                <Left>단백질</Left>
                <Right>{nutrition.protein}</Right>
              </Row>
            </Table>
          );
        })}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const Wrapper = styled.div`
  margin-top: 48px;
`;

const Table = styled.div`
  margin-bottom: 36px;
`;

const Row = styled.div`
  max-width: 484px;
  width: 100%;
  flex-direction: row;
  display: flex;
  border-bottom: 1px solid ${theme.greyScale6};
`;
const Left = styled.div`
  ${textBody3}
  max-width: 74px;
  width: 100%;
  background-color: ${theme.greyScale6};
  padding: 8px;
`;
const Right = styled.div`
  ${textBody3}
  padding: 8px;
  max-width: 410px;
  width: 100%;
  color: ${theme.greyScale65};
`;

export default NutritionInfoPage;
