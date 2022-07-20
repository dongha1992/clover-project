import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import styled from 'styled-components';
interface IProps {
  delivery: string;
  deliveryDetail: string;
}
const CancelOrderInfoBox = ({ delivery, deliveryDetail }: IProps) => {
  const isLunch = deliveryDetail === 'LUNCH';
  return (
    <div>
      {delivery === ('QUICK' || 'SPOT') && (
        <>
          <TextB3R color={theme.brandColor}>주문 변경 및 취소는 수령일 당일 오전 7시까지 가능해요!</TextB3R>
          <TextB3R color={theme.brandColor}>
            단, 수령일 오전 7시~{isLunch ? '9시 25' : '10시 55'}분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및
            취소할 수 있어요!
          </TextB3R>
        </>
      )}
      {delivery === ('PARCEL' || 'MORNING') && (
        <>
          <TextB3R color={theme.brandColor}>주문 변경 및 취소는 수령일 하루 전 오후 3시까지 가능해요!</TextB3R>
          <TextB3R color={theme.brandColor}>
            단, 수령일 오후 3시~4시 55분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및 취소할 수 있어요!
          </TextB3R>
        </>
      )}
    </div>
  );
};

export default CancelOrderInfoBox;
