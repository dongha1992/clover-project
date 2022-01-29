import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const MorningInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B color={theme.brandColor} padding="0 4px 0 0">
          새벽배송
        </TextH2B>
        <TextH2B>지역입니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        오후 5시까지 주문 시 다음날 새벽에 도착!
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        서울 전체, 경기/인천 일부 지역 이용 가능해요
      </TextB3R>
    </>
  );
};

export default MorningInfo;
