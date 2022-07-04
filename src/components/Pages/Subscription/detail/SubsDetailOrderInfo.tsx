import { TextH4B } from '@components/Shared/Text';
import useSubsOrderStatus from '@hooks/subscription/useSubsOrderStatus';
import { subscriptionForm } from '@store/subscription';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import SubsDetailOrderBox from './SubsDetailOrderBox';

interface IProps {
  status: string;

  orderId: number;
}

const SubsDetailOrderInfo = ({ status, orderId }: IProps) => {
  const { subsCalendarSelectOrders } = useSelector(subscriptionForm);
  const orderStatus = useSubsOrderStatus(subsCalendarSelectOrders[0]?.status, status);
  return (
    <Container>
      <TextH4B padding="24px 24px 0">
        {orderStatus} ({subsCalendarSelectOrders.length})
      </TextH4B>
      <ul className="SubsDetailOrderWrapper">
        {subsCalendarSelectOrders.map((item: any, index: number) => (
          <li key={index}>
            <SubsDetailOrderBox item={item} orderId={orderId} />
          </li>
        ))}
      </ul>
    </Container>
  );
};
const Container = styled.div`
  ul.SubsDetailOrderWrapper {
    /* padding: 0 24px; */
    > li {
      border-top: 1px solid #f2f2f2;
      &:first-of-type {
        border-top: none;
      }
    }
  }
`;
export default SubsDetailOrderInfo;
