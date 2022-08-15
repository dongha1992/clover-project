import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexEnd, theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import styled from 'styled-components';
interface IProps {
  refundPayAmount: number;
  refundPoint: number;
  refundCoupon: number;
  refundCouponCount?: number;
}
const RefundPriceBox = ({ refundPayAmount, refundPoint, refundCoupon, refundCouponCount }: IProps) => {
  return (
    <RefundPriceContainer>
      <div className="box">
        <FlexBetween padding="16px 0 16px">
          <TextH4B>최종 환불 합계</TextH4B>
          <TextH4B>{getFormatPrice(String(refundPayAmount + refundPoint + refundCoupon))}원</TextH4B>
        </FlexBetween>
      </div>
      <RefundDetailBox>
        {refundPayAmount !== 0 && (
          <FlexBetween padding="0 0 8px">
            <TextB2R>환불 금액</TextB2R>
            <TextB2R>{getFormatPrice(String(refundPayAmount))}원</TextB2R>
          </FlexBetween>
        )}
        {refundPoint !== 0 && (
          <FlexBetween padding="0 0 8px">
            <TextB2R>환불 포인트</TextB2R>
            <TextB2R>{getFormatPrice(String(refundPoint))}원</TextB2R>
          </FlexBetween>
        )}
        <FlexBetween>
          <TextB2R>환불 쿠폰</TextB2R>
          <TextB2R>{refundCouponCount ?? 0}개</TextB2R>
        </FlexBetween>
      </RefundDetailBox>
    </RefundPriceContainer>
  );
};
const RefundPriceContainer = styled.article`
  padding: 0 24px 0 24px;
  /* background-color: ${theme.greyScale3}; */
  .box {
    border-top: 1px solid ${theme.black};
    li {
      display: flex;
      padding-bottom: 8px;
      justify-content: space-between;
      &:last-of-type {
        padding-bottom: 16px;
        border-bottom: 1px solid ${theme.black};
      }
    }
  }
`;
const RefundDetailBox = styled.div`
  padding: 16px;
  background-color: ${theme.greyScale3};
`;

export default RefundPriceBox;
