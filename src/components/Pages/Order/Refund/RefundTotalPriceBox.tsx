import { TextB2R, TextB4R, TextH4B, TextH5B } from '@components/Shared/Text';
import { FlexBetween, FlexCol } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  cancelPrivew: {
    totalPayAmount: number;
    completedDeliveryCount: number;
    completedAmount: number;
    partialRefundAmount: number;
    refundPayAmount: number;
    refundPoint: number;
    couponCount: number;
  };
}

const RefundTotalPriceBox = ({ cancelPrivew }: IProps) => {
  return (
    <RefundInfoContainer>
      <ul>
        <li className="row">
          <TextH5B>총 결제금액</TextH5B>
          <TextB2R>{getFormatPrice(String(cancelPrivew?.totalPayAmount))}원</TextB2R>
        </li>
        <li className="col">
          <FlexBetween padding="0 0 16px">
            <TextH5B>배송받은 횟수</TextH5B>
            <TextB2R>{getFormatPrice(String(cancelPrivew?.completedDeliveryCount))}원</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>배송받은 횟수</TextH5B>
            <TextB2R>{getFormatPrice(String(cancelPrivew?.completedAmount))}원</TextB2R>
          </FlexBetween>
        </li>
        <li className="row">
          <TextH5B>이전 환불 금액</TextH5B>
          <TextB2R>{getFormatPrice(String(cancelPrivew?.partialRefundAmount))}원</TextB2R>
        </li>
        <li className="col">
          <FlexBetween padding="0 0 8px">
            <TextH5B>총 환불금액</TextH5B>
            <TextB2R>{getFormatPrice(String(cancelPrivew?.refundPayAmount))}원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="0 0 8px">
            <TextB2R>환불금액</TextB2R>
            <TextB2R>
              {cancelPrivew && getFormatPrice(String(cancelPrivew?.refundPayAmount - cancelPrivew?.refundPoint))}
            </TextB2R>
          </FlexBetween>
          <FlexBetween padding="0 0 8px">
            <TextB2R>환불 포인트</TextB2R>
            <TextB2R>{getFormatPrice(String(cancelPrivew?.refundPoint))}원</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextB2R>환불 쿠폰</TextB2R>
            <TextB2R>{getFormatPrice(String(cancelPrivew?.couponCount))}개</TextB2R>
          </FlexBetween>
        </li>
        <li>
          <FlexBetween>
            <TextH4B>최종 환불금액</TextH4B>
            <TextH4B>{getFormatPrice(String(cancelPrivew?.refundPayAmount))}원</TextH4B>
          </FlexBetween>
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
export default RefundTotalPriceBox;
