import React from 'react';
import styled from 'styled-components';
import NextImage from 'next/image';

const SpotNoticePage = () => {
  return (
    <Container>
      <NextImage 
        src='/images/img_fcospot_detail_info.png'
        width={'512px'}
        height={'1720px'}
        alt="프코스팟 안내 이미지"
        className='main-img'
        layout="responsive"
      />
    </Container>
  )
};

const Container = styled.main`
  width: 100%;
  height: 100%;
  .main-img {
    height: auto !important;
  }
`;

export default SpotNoticePage;