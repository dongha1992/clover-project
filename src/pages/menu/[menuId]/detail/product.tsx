import React from 'react';
import styled from 'styled-components';
import { IProductInfo } from '@model/index';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { TextH5B } from '@components/Shared/Text';

import { textBody3, theme } from '@styles/theme';
const ProductInfoPage = () => {
  const { info } = useSelector(menuSelector);

  return (
    <Container>
      <Wrapper>
        {info.productInfoNotis.map((productInfo: IProductInfo, index: number) => {
          return (
            <Table key={index}>
              <TextH5B padding="0 0 18px 0">{productInfo.name}</TextH5B>
              <Row>
                <Left>내용량</Left>
                {/* <Right>{productInfo.productInfoInfo}</Right> */}
              </Row>
              <Row>
                <Left>식품의 유형</Left>
                <Right>{productInfo.foodType}</Right>
              </Row>
              <Row>
                <Left>원재료 및 함량</Left>
                <Right>{productInfo.rawMaterial}</Right>
              </Row>
              <Row>
                <Left>영양정보</Left>
                {/* <Right>{productInfo.carbohydrates}</Right> */}
              </Row>
              <Row>
                <Left>알레르기 물질 함유</Left>
                <Right>{productInfo.allergens}</Right>
              </Row>
              <Row>
                <Left>유통기한</Left>
                <Right>{productInfo.shelfLife}</Right>
              </Row>
              <Row>
                <Left>포장재질</Left>
                <Right>{productInfo.packingMaterial}</Right>
              </Row>
              <Row>
                <Left>업소명 및 소재지</Left>
                {/* <Right>{productInfo.saturatedFat}</Right> */}
              </Row>
              <Row>
                <Left>보관방법</Left>
                <Right>{productInfo.storage}</Right>
              </Row>
              <Row>
                <Left>소비자 상담실</Left>
                <Right>{productInfo.serviceCenterTel}</Right>
              </Row>
              <Row>
                <Left>반품 및 교환장소</Left>
                <Right>{productInfo.returnExchangePlace}</Right>
              </Row>
              <RowLast>
                <Left>주의사항</Left>
                <Right>{productInfo.precautions}</Right>
              </RowLast>
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

const RowLast = styled.div`
  max-width: 484px;
  width: 100%;
  flex-direction: row;
  display: flex;
  border-top: 2px solid ${theme.black};
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
`;

export default ProductInfoPage;
