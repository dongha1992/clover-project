import React from 'react';
import styled from 'styled-components';
import { IProductInfo } from '@model/index';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { TextH5B } from '@components/Shared/Text';

const NutritionInfoPage = () => {
  const { info } = useSelector(menuSelector);

  return (
    <Container>
      <Table>
        <TextH5B padding="0 0 18px 0"></TextH5B>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const Table = styled.div``;

export default NutritionInfoPage;
