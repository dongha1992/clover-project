import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { getFormatPrice } from '@utils/common';
interface IProps {
  url: string;
  name: string;
  amount: number;
  paidAt?: string;
}

const ItemInfo = ({ url, name, amount, paidAt }: IProps) => {
  return (
    <Container>
      <ImageWrapper>
        <ItemImage src={IMAGE_S3_URL + url} alt="상품이미지" />
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
