import { TextB2R, TextH4B, TextH5B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  totalPayAmount: number;
  totalRefundAmount: number;
  completedDeliveryCount: number;
  completedAmount: number;
  partialRefundAmount: number;
  refundPoint: number;
  refundCoupon: number;
  refundCouponCount?: number;
  refundPayAmount: number;
}

const RefundInfoBox = ({
  totalPayAmount,
  totalRefundAmount,
  completedDeliveryCount,
  completedAmount,
  partialRefundAmount,
  refundPoint,
  refundCoupon,
  refundCouponCount,
  refundPayAmount,
}: IProps) => {
  return (
    <RefundInfoContainer>
      <ul>
        <li className="row">
          <TextH5B>총 결제금액</TextH5B>
          <TextB2R>{getFormatPrice(String(totalPayAmount))}원</TextB2R>
        </li>
        <li className="col bBotom">
          <FlexBetween padding="0 0 16px">
            <TextH5B>배송받은 횟수</TextH5B>
            <TextB2R>{getFormatPrice(String(completedDeliveryCount))}회</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>배송받은 상품금액</TextH5B>
            <TextB2R>{getFormatPrice(String(completedAmount))}원</TextB2R>
          </FlexBetween>
        </li>
        {partialRefundAmount !== 0 && (
          <li className="row">
            <TextH5B>이전 환불 금액</TextH5B>
            <TextB2R>{getFormatPrice(String(partialRefundAmount))}원</TextB2R>
          </li>
        )}
        <li className="col">
          <FlexBetween padding="0 0 16px">
            <TextH4B>최종 환불 합계</TextH4B>
            <TextH4B>{getFormatPrice(String(totalRefundAmount))}원</TextH4B>
          </FlexBetween>
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
              <TextB2R>{refundCoupon ? 1 : 0}개</TextB2R>
            </FlexBetween>
          </RefundDetailBox>
        </li>
      </ul>
    </RefundInfoContainer>
  );
};
const RefundInfoContainer = styled.div`
  ul {
    li {
      display: flex;

      border-bottom: 1px solid #ececec;
      padding: 16px 0;
      &.row {
        justify-content: space-between;
      }
      &.col {
        flex-direction: column;
      }
      &.bBotom {
        border-bottom: 1px solid ${theme.black};
      }
      &:first-of-type {
        padding-top: 0;
      }
      &:last-of-type {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
`;

const RefundDetailBox = styled.div`
  padding: 16px;
  background-color: ${theme.greyScale3};
`;

export default RefundInfoBox;
