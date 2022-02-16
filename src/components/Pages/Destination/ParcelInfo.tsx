import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const ParcelInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor}>택배배송</TextH2B>
        <TextH2B padding="0 4px 0 0">만</TextH2B>
        <TextH2B>가능한 지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        오후 5시까지 주문 시 당일 발송!
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        전국 어디서나 이용할 수 있어요. (제주, 도서 산간지역 제외)
      </TextB3R>
    </>
  );
};

export default ParcelInfo;
