import { TextB2R, TextH2B } from '@components/Shared/Text';
import { DescriptionBox } from '@pages/subscription/[detailId]/sub-cancel';
import { theme } from '@styles/theme';

const OrderCancelDesBox = () => {
  return (
    <DescriptionBox>
      <TextH2B>
        주문취소가 정상적으로
        <br />
        완료되었어요.
      </TextH2B>
      <TextB2R color={theme.greyScale65} padding="16px 0 0">
        마이 {'>'} 주문/배송 내역에서 <br />
        취소 내역을 확인하실 수 있어요
      </TextB2R>
    </DescriptionBox>
  );
};
export default OrderCancelDesBox;
