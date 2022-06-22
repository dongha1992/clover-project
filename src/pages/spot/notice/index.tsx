import React from 'react';
import styled from 'styled-components';
import { IMAGE_S3_DEV_URL } from '@constants/mock';

const SpotNoticePage = () => {
  return (
    <Container>
      <Img src={`${IMAGE_S3_DEV_URL}/img_detail_fco_info.png`} />
    </Container>
  )
};

const Container = styled.main`
  width: 100%;
  height: 100%;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

export default SpotNoticePage;