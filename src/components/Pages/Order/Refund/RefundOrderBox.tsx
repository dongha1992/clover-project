import { TextB3R, TextH5B, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexEnd, FlexRow, theme } from '@styles/theme';
import { getFormatDate, getFormatPrice, SVGIcon } from '@utils/common';
import Image from '@components/Shared/Image';
import router from 'next/router';
import styled from 'styled-components';
import RefundPriceBox from './RefundPriceBox';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';
import { calculatePoint } from '@utils/menu';

interface IProps {
  subOrder: any;
}
const RefundOrderBox = ({ subOrder }: IProps) => {
  const { me } = useSelector(userForm);

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
              src={subOrder.image.url}
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
        refundPayAmount={subOrder.order.refundPayAmount}
        refundPoint={subOrder.order.refundPoint}
        refundCoupon={subOrder.order.refundCoupon}
      />
      <FlexEnd margin="16px 0 0" padding="0 24px">
        <Badge>
          <TextH7B>{me?.grade?.name}</TextH7B>
        </Badge>
        <TextH6B>
          {calculatePoint({
            rate: me?.grade.benefit.accrualRate!,
            total: subOrder.order.refundCoupon + subOrder.order.refundPoint + subOrder.order.refundPayAmount,
          })}
          P 적립 취소 예정
        </TextH6B>
      </FlexEnd>
    </RefundOrderContainer>
  );
};
const RefundOrderContainer = styled.div`
  padding-bottom: 24px;
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
const Badge = styled.div`
  padding: 4px 8px;
  margin-right: 4px;
  background-color: ${theme.brandColor5P};
  color: ${theme.brandColor};
`;

export default RefundOrderBox;
