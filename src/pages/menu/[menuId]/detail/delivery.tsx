import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import Image from '@components/Shared/Image';
import { IImage } from '@model/index';
import { TextB2R } from '@components/Shared/Text';

const DeliveryInfoPage = () => {
  const { info } = useSelector(menuSelector);

  return (
    <Container>
      <Wrapper>
        {info?.deliveryMethods?.length > 0 ? (
          info?.deliveryMethods?.map((item: IImage, index: number) => {
            return (
              <ImageWrapper key={index}>
                <Image src={item?.url} alt="배송방법이미지" width="512px" height="100%" layout={"fill"}/>
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

const ImageWrapper = styled.div`
  position: relative;
  span {
    position: relative!important;
  }
  img {
    position: relative!important;
    height: auto!important;
  }
`;
export default DeliveryInfoPage;
