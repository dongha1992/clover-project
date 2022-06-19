import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
// import Image from 'next/image';
import { IMAGE_S3_URL } from '@constants/mock';
import { IMenuImage } from '@model/index';
import { TextB2R } from '@components/Shared/Text';

const DeliveryInfoPage = () => {
  const { info } = useSelector(menuSelector);

  return (
    <Container>
      <Wrapper>
        {info?.deliveryMethods?.length > 0 ? (
          info?.deliveryMethods?.map((item: IMenuImage, index: number) => {
            return (
              <ImageWrapper key={index}>
                <Image src={IMAGE_S3_URL + item?.url} alt="배송방법이미지" width={'100%'} height={'100%'} />
              </ImageWrapper>
            );
          })
        ) : (
          <TextB2R>준비중입니다.</TextB2R>
        )}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  margin-top: 120px;
`;

const ImageWrapper = styled.div``;
const Image = styled.img``;
export default DeliveryInfoPage;
