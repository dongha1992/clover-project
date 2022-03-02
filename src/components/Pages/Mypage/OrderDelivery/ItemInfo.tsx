import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';

interface IProps {
  url: string;
  name: string;
  payAmount: string;
  paidAt: string;
}

const ItemInfo = ({ url, name, payAmount, paidAt }: IProps) => {
  return (
    <FlexRow padding="0 0 16px 0px">
      <ImageWrapper>
        <ItemImage src={IMAGE_S3_URL + url} alt="상품이미지" />
      </ImageWrapper>
      <FlexCol width="70%" margin="0 0 0 16px">
        <TextB2R padding="0 0 4px 0">{name}</TextB2R>
        <FlexBetween>
          <TextH5B>{payAmount}원</TextH5B>
          <TextB3R color={theme.greyScale65}>{paidAt} 결제</TextB3R>
        </FlexBetween>
      </FlexCol>
    </FlexRow>
  );
};

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default React.memo(ItemInfo);
