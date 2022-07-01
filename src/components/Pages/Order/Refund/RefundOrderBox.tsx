import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { FlexBetween, FlexRow } from '@styles/theme';
import { getFormatDate, getFormatPrice, SVGIcon } from '@utils/common';
import Image from 'next/image';
import router from 'next/router';
import styled from 'styled-components';
import RefundPriceBox from './RefundPriceBox';

interface IProps {
  subOrder: any;
}
const RefundOrderBox = ({ subOrder }: IProps) => {
  const goToOrderDetail = () => {
    router.push(`/mypage/order-detail/${subOrder.order.id}`);
  };

  return (
    <RefundOrderContainer>
      <article className="orderInfo">
        <FlexBetween padding="0 0 16px">
          <FlexRow>
            <SVGIcon name="delivery" />
            <TextH5B>{getFormatDate(subOrder.deliveryDate)} 도착예정</TextH5B>
          </FlexRow>
          <TextH6B pointer textDecoration="underline" color="#757575" onClick={goToOrderDetail}>
            주문상세 보기
          </TextH6B>
        </FlexBetween>
        <OrderItem>
          <div className="imgBox">
            <Image
              src={IMAGE_S3_URL + subOrder.image.url}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </div>
          <div className="textBox">
            <TextB3R textHideMultiline>{subOrder.order.name}</TextB3R>
            <TextH5B>{getFormatPrice(String(subOrder.order.payAmount))}원</TextH5B>
          </div>
        </OrderItem>
      </article>
      <RefundPriceBox
        amount={subOrder.order.amount}
        payAmount={subOrder.order.payAmount}
        point={subOrder.order.point}
        coupon={subOrder.order.coupon}
      />
    </RefundOrderContainer>
  );
};
const RefundOrderContainer = styled.div`
  .orderInfo {
    padding: 24px;
  }
`;
export const OrderItem = styled.div`
  display: flex;
  .imgBox {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
  }
  .textBox {
    padding-left: 8px;
  }
`;

export default RefundOrderBox;
