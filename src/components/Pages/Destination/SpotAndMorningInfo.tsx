import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const SpotAndMorningInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor} padding="0 4px 0 0">
          스팟/새벽배송
        </TextH2B>
        <TextH2B>이 가능한 지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        점심·저녁 원하는 시간에 픽업 하거나 (서울 한정)
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        오후 5시까지 주문 시 다음날 새벽배송도 가능해요!
      </TextB3R>
    </>
  );
};

export default SpotAndMorningInfo;
