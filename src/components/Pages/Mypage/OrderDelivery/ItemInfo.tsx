import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import { getFormatPrice } from '@utils/common';
import Image from '@components/Shared/Image';
interface IProps {
  url: string;
  name: string;
  amount: number;
  paidAt?: string;
}

const ItemInfo = ({ url, name, amount, paidAt }: IProps) => {
  console.log(url);
  return (
    <Container>
      <ImageWrapper>
        <Image src={url} alt="상품이미지" width={'100%'} height={'100%'} layout="responsive" className="rounded" />
      </ImageWrapper>
      <FlexCol width="80%" margin="0 0 0 16px">
        <TextB2R padding="0 0 4px 0">{name}</TextB2R>
        <FlexBetween>
          <TextH5B>{getFormatPrice(String(amount))}원</TextH5B>
          {paidAt && <TextB3R color={theme.greyScale65}>{paidAt} 결제</TextB3R>}
        </FlexBetween>
      </FlexCol>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 512px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(ItemInfo);
