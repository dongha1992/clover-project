import SubsCalendar from '@components/Calendar/SubsCalendar';
import { SubsOrderItem } from '@components/Pages/Subscription/payment';
import BorderLine from '@components/Shared/BorderLine';
import { TextH4B, TextH6B } from '@components/Shared/Text';
import { subscriptionForm } from '@store/subscription';
import { theme } from '@styles/theme';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const SubsDetailPage = () => {
  const { subsDeliveryExpectedDate } = useSelector(subscriptionForm);
  return (
    <Container>
      <InfoBox>
        <TextH4B padding="0 0 24px 0">구독 중 - 1회차</TextH4B>
        <SubsOrderItem />
      </InfoBox>
      <BorderLine height={8} />
      <DietConfirmBox>
        <TextH4B>식단 확인</TextH4B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
          전체 식단 보기
        </TextH6B>
      </DietConfirmBox>
      <SubsCalendar subsDates={subsDeliveryExpectedDate} deliveryExpectedDate={subsDeliveryExpectedDate} />
    </Container>
  );
};
const Container = styled.div``;
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
export default SubsDetailPage;
