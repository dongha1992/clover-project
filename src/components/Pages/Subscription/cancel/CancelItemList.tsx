import { OrderItem } from '@components/Pages/Order/Refund/RefundOrderBox';
import { TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import Image from '@components/Shared/Image';
import styled from 'styled-components';
interface IProps {
  cancelList: any;
}
const CancelItemList = ({ cancelList }: IProps) => {
  return (
    <CancelItemListContainer>
      <TextH4B padding="0 0 24px 0" color={theme.greyScale65}>
        취소완료
      </TextH4B>
      {cancelList.map((item: any) => (
        <OrderItem key={item.id}>
          <div className="imgBox">
            <Image
              src={item?.image.url}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </div>
          <div className="textBox">
            <TextB3R textHideMultiline>{item?.order?.name}</TextB3R>
            <TextH5B>{getFormatPrice(String(item?.order?.payAmount))}원</TextH5B>
          </div>
        </OrderItem>
      ))}
    </CancelItemListContainer>
  );
};
const CancelItemListContainer = styled.div`
  padding: 24px;
`;
export default CancelItemList;
