import SubsCalendar from '@components/Calendar/SubsCalendar';
import { SubsDetailOrderBox } from '@components/Pages/Subscription/detail';
import { SubsOrderItem } from '@components/Pages/Subscription/payment';
import { Label } from '@components/Pages/Subscription/SubsCardItem';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { FlexBetween, FlexBetweenStart, FlexColEnd, FlexEnd, FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const SubsDetailPage = () => {
  const { subsDeliveryExpectedDate } = useSelector(subscriptionForm);
  return (
    <Container>
      <InfoBox>
        <TextH4B padding="0 0 24px 0">구독 중 - 1회차</TextH4B>
        {/* <SubsOrderItem /> */}
      </InfoBox>
      <BorderLine height={8} />
      <DietConfirmBox>
        <TextH4B>식단 확인</TextH4B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
          전체 식단 보기
        </TextH6B>
      </DietConfirmBox>
      {/* <SubsCalendar subsActiveDates={subsDeliveryExpectedDate} deliveryExpectedDate={subsDeliveryExpectedDate} /> */}
      <TextH4B padding="24px 24px 0">주문완료 (1)</TextH4B>
      <ul className="SubsDetailOrderWrapper">
        {[1, 2].map((item, index) => (
          <li key={index}>
            <SubsDetailOrderBox />
          </li>
        ))}
      </ul>
      <BorderLine height={8} />
      <SubsInfoBox>
        <TextH4B padding="0 0 24px 0">구독정보</TextH4B>
        <FlexBetween padding="0 0 16px">
          <TextH5B>배송주기</TextH5B>
          <TextB2R>주 2회 / 월·목</TextB2R>
        </FlexBetween>
        <FlexBetweenStart>
          <TextH5B>구독기간</TextH5B>
          <FlexColEnd>
            <TextB2R>정기구독 1회차</TextB2R>
            <TextB2R>1월 20일 (목) ~ 2월 19일 (금)</TextB2R>
          </FlexColEnd>
        </FlexBetweenStart>
      </SubsInfoBox>
      <BorderLine height={8} />
      <OrderInfoBox>
        <TextH4B padding="0 0 24px 0">주문정보</TextH4B>
        <FlexBetween padding="0 0 16px">
          <TextH5B>주문번호</TextH5B>
          <TextB2R>7777777</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px">
          <TextH5B>주문상태</TextH5B>
          <TextB2R>주문완료</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px">
          <TextH5B>결제일시</TextH5B>
          <TextB2R>2021-11-16 14:28</TextB2R>
        </FlexBetween>
        <FlexBetweenStart padding="0 0 24px">
          <TextH5B>결제수단</TextH5B>
          <FlexColEnd>
            <TextB2R>정기결제 / 신용카드</TextB2R>
            <TextB3R color="#717171">다음 결제일은 1월 27일 입니다.</TextB3R>
          </FlexColEnd>
        </FlexBetweenStart>
        <Button backgroundColor="#fff" color="#242424" border>
          결제수단 변경하기
        </Button>
      </OrderInfoBox>
      <BorderLine height={8} />
      <PaymentInfoBox>
        <TextH4B padding="0 0 24px 0">결제정보</TextH4B>
        <FlexBetween padding="0 0 16px" className="bbN">
          <TextH5B>총 상품금액</TextH5B>
          <TextB2R>264,800원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 8px">
          <TextH5B>총 할인금액</TextH5B>
          <TextB2R>-264,800원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 8px">
          <FlexRow>
            <TextB2R margin="0 2px">구독 할인</TextB2R>
            <SVGIcon name="questionMark" />
          </FlexRow>
          <TextB2R>-264,800원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 8px">
          <TextB2R margin="0 2px">이벤트 할인</TextB2R>
          <TextB2R>-264,800원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px" className="bbN">
          <TextB2R margin="0 2px">쿠폰 사용</TextB2R>
          <TextB2R>0원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 8px">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>5개 / 500원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 8px">
          <TextB2R margin="0 2px">포크+물티슈</TextB2R>
          <TextB2R>5개 / 500원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px" className="bbN">
          <TextB2R margin="0 2px">젓가락+물티슈</TextB2R>
          <TextB2R>5개 / 500원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 8px">
          <TextH5B>배송비</TextH5B>
          <TextB2R>9회 / 0원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px" className="bbN">
          <TextB2R margin="0 2px">배송비 할인</TextB2R>
          <TextB2R>-31,700원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 16px" className="bbB">
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>777,777원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 8px">
          <TextH4B>최종 결제금액</TextH4B>
          <TextB2R>777,777원</TextB2R>
        </FlexBetween>
        <FlexEnd>
          <Label className="subs">프코 회원</Label>
          <TextB3R>
            구독회차 완료 시 <b>5,924 포인트 적립 예정</b>
          </TextB3R>
        </FlexEnd>
      </PaymentInfoBox>
      <BorderLine height={8} />
      <FlexRow padding="24px">
        <Button backgroundColor="#fff" color="#242424" border>
          주문 취소하기
        </Button>
      </FlexRow>
    </Container>
  );
};
const Container = styled.div`
  ul.SubsDetailOrderWrapper {
    padding: 0 24px;
    li {
      border-top: 1px solid #f2f2f2;
      &:first-of-type {
        border-top: none;
      }
    }
  }
`;
const InfoBox = styled.div`
  padding: 24px;
`;
const DietConfirmBox = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SubsInfoBox = styled.div`
  padding: 24px;
`;
const OrderInfoBox = styled.div`
  padding: 24px;
`;
const PaymentInfoBox = styled.div`
  padding: 24px;
  .bbN {
    border-bottom: 1px solid #ececec;
  }
  .bbB {
    border-bottom: 1px solid #242424;
  }
  svg {
    margin-bottom: 3px;
  }
`;
export default SubsDetailPage;
