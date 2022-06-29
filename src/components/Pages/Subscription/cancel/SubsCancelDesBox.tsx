import { TextB2R, TextH2B } from '@components/Shared/Text';
import { DescriptionBox } from '@pages/subscription/[detailId]/sub-cancel';
import { theme } from '@styles/theme';

const SubsCancelDesBox = () => {
  return (
    <DescriptionBox>
      <TextH2B>
        구독 주문취소가 정상적으로
        <br />
        완료되었어요.
      </TextH2B>
      <TextB2R color={theme.greyScale65} padding="16px 0 0">
        마이 {'>'} 구독 관리에서 <br />
        취소 내역을 확인하실 수 있어요
      </TextB2R>
    </DescriptionBox>
  );
};
export default SubsCancelDesBox;
