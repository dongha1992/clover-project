import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B, TextH7B } from '@components/Shared/Text';
import { FlexBetween, FlexEnd, theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import styled from 'styled-components';
interface IProps {
  amount: number;
  payAmount: number;
  point: number;
  coupon: number;
}
const RefundPriceBox = ({ amount, payAmount, point, coupon }: IProps) => {
  return (
    <RefundPriceContainer>
      <ul>
        <li>
          <TextH5B>총 결제금액</TextH5B>
          <TextB2R>{getFormatPrice(String(amount))}원</TextB2R>
        </li>
        <li>
          <TextB2R>환불금액</TextB2R>
          <TextB2R>{getFormatPrice(String(payAmount))}원</TextB2R>
        </li>
        <li>
          <TextB2R>환불 포인트</TextB2R>
          <TextB2R>{getFormatPrice(String(point))}원</TextB2R>
        </li>
        <li>
          <TextB2R>환불 쿠폰</TextB2R>
          <TextB2R>{coupon}개</TextB2R>
        </li>
      </ul>
      <FlexBetween padding="16px 0 0">
        <TextH4B>최종 환불금액</TextH4B>
        <TextH4B>{getFormatPrice(String(amount))}원</TextH4B>
      </FlexBetween>
      <FlexEnd>
        <Badge>
          <TextH7B>프코회원</TextH7B>
        </Badge>
        <TextH6B>210P 적립 취소 예정</TextH6B>
      </FlexEnd>
    </RefundPriceContainer>
  );
};
const RefundPriceContainer = styled.article`
  padding: 24px;
  background-color: ${theme.greyScale3};
  ul {
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
const Badge = styled.div`
  padding: 4px 8px;
  margin-right: 4px;
  background-color: ${theme.brandColor5P};
  color: ${theme.brandColor};
`;

export default RefundPriceBox;
