import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const CanNotDeliveryInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor} padding="0 4px 0 0">
          배송불가
        </TextH2B>
        <TextH2B>지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        신선식품의 특성상 일부지역의 배송이 불가해요!
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        (섬/공단지역/학교/학교 기숙사/병원/군부대/시장/백화점 등)
      </TextB3R>
    </>
  );
};

export default CanNotDeliveryInfo;
