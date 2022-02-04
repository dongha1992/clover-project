import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const QuickAndMorningInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor} padding="0 4px 0 0">
          퀵/새벽배송
        </TextH2B>
        <TextH2B>지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        평일, 점심·저녁에 퀵하게 받거나 (서울 한정)
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        오후 5시까지 주문 시 다음날 새벽배송도 가능해요!
      </TextB3R>
    </>
  );
};

export default QuickAndMorningInfo;
