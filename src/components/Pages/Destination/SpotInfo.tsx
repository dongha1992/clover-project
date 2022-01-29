import React from 'react';
import { FlexRow, theme } from '@styles/theme';
import { TextH2B, TextB3R } from '@components/Shared/Text';

const SpotInfo = () => {
  return (
    <>
      <FlexRow>
        <TextH2B>주변에</TextH2B>
        <TextH2B color={theme.brandColor} padding="0 0 0 4px">
          프코스팟
        </TextH2B>
        <TextH2B>이 있습니다.</TextH2B>
      </FlexRow>
      <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
        점심·저녁 원하는 시간에 픽업 가능!
      </TextB3R>
      <TextB3R color={theme.greyScale65}>
        서울 내 등록된 프코스팟에서 배송비 무료로 이용 가능해요
      </TextB3R>
    </>
  );
};

export default SpotInfo;
