import React from 'react';
import { FlexCol, theme } from '@styles/theme';
import { TextH6B, TextB3R, TextH5B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';

const ReviewInfoBottom = () => {
  return (
    <>
      <TextH5B color={theme.greyScale65}>포인트 적립 유의사항</TextH5B>
      <BorderLine height={1} margin="16px 0" />
      <TextH6B color={theme.greyScale65}>
        [샐러드/건강간식/세트 상품] 수령일 기준 7일 내 제품만 등록 가능합니다.
      </TextH6B>
      <FlexCol>
        <TextB3R color={theme.greyScale65}>[정기배송 상품] 2회 수령 후 30일 내 등록 가능합니다.</TextB3R>
        <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
          후기 작성일 기준 2-3일 내 적립금이 자동 지급됩니다. (영업일 외 명절 및 공휴일은 지연될 수 있음)
        </TextB3R>
        <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
          상품마다 개별 작성건만 적립됩니다.
        </TextB3R>
        <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
          사진 후기는 자사 제품 사진의 경우만 해당합니다.
        </TextB3R>
        <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
          비방성, 광고글, 문의사항 후기는 관리자 임의로 삭제될 수 있습니다.
        </TextB3R>
        <TextB3R color={theme.greyScale65} padding="4px 0 0 0">
          상품을 교환하여 후기를 수정하거나 추가 작성하는 경우 추가 적립금 미지급됩니다.
        </TextB3R>
      </FlexCol>
    </>
  );
};

export default ReviewInfoBottom;
