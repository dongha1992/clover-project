import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const MorningAndPacelInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor} padding="0 4px 0 0">
          새벽/택배배송이 가능한
        </TextH2B>
        <TextH2B>지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        오후 5시까지 주문하면 다음날 새벽배송!
      </TextB3R>
      <TextB3R color={theme.greyScale65}>당일 택배 발송도 가능해요.</TextB3R>
    </>
  );
};

export default MorningAndPacelInfo;
