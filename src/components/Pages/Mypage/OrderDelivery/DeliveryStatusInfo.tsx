import { FlexBetween, FlexRow, theme } from '@styles/theme';
import React from 'react';
import { TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import router from 'next/router';
import { DeliveryTag } from '@components/Shared/Tag';

interface IProps {
  isCanceled?: boolean;
  isCompleted?: boolean;
  deliveryStatus: string;
  deliveryDetail?: string;
  id: number;
  deliveryType: string;
}

const DeliveryStatusInfo = ({ isCompleted, isCanceled, deliveryStatus, deliveryDetail, id, deliveryType }: IProps) => {
  return (
    <FlexBetween>
      <FlexRow margin="0 0 8px 0">
        <TextH5B color={isCanceled ? theme.greyScale65 : theme.black}>{deliveryStatus}</TextH5B>
        <DeliveryTag deliveryType={deliveryType} margin="0 4px 0 8px" />
        {deliveryDetail && (
          <Tag backgroundColor={theme.white} color={theme.brandColor} border={theme.brandColor}>
            {deliveryDetail}
          </Tag>
        )}
      </FlexRow>
      {!isCanceled && (
        <TextH6B textDecoration="underline" color="#757575" onClick={() => router.push(`/mypage/order-detail/${id}`)}>
          주문상세 보기
        </TextH6B>
      )}
    </FlexBetween>
  );
};

export default React.memo(DeliveryStatusInfo);
