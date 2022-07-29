import { Button } from '@components/Shared/Button';
import styled from 'styled-components';

interface IProps {
  subscriptionPeriod: string;
  isSubscribing: boolean;
  status: string;
  reorderHandler: () => void;
  orderCancelHandler: () => void;
}

const SubsBottomBtn = ({ subscriptionPeriod, isSubscribing, status, reorderHandler, orderCancelHandler }: IProps) => {
  return (
    <Container>
      {/* 정기구독 */}
      {isSubscribing && subscriptionPeriod === 'UNLIMITED' && (status === 'UNPAID' || status === 'RESERVED') && (
        <Button backgroundColor="#fff" color="#242424" border onClick={orderCancelHandler}>
          구독 해지하기
        </Button>
      )}
      {isSubscribing && subscriptionPeriod === 'UNLIMITED' && status === 'PROGRESS' && (
        <Button backgroundColor="#fff" color="#242424" border onClick={orderCancelHandler}>
          주문 취소하기
        </Button>
      )}
      {!isSubscribing && subscriptionPeriod === 'UNLIMITED' && (status === 'CANCELED' || status === 'COMPLETED') && (
        <Button backgroundColor="#fff" color="#242424" border onClick={reorderHandler}>
          재주문하기
        </Button>
      )}

      {/* 단기구독 */}
      {!isSubscribing &&
        subscriptionPeriod !== 'UNLIMITED' &&
        (status === 'PROGRESS' || status === 'RESERVED' || status === 'UNPAID') && (
          <Button backgroundColor="#fff" color="#242424" border onClick={orderCancelHandler}>
            주문 취소하기
          </Button>
        )}
      {!isSubscribing && subscriptionPeriod !== 'UNLIMITED' && status === 'CANCELED' && (
        <Button backgroundColor="#fff" color="#242424" border onClick={reorderHandler}>
          재주문하기
        </Button>
      )}
      {!isSubscribing && subscriptionPeriod !== 'UNLIMITED' && status === 'COMPLETED' && (
        <Button backgroundColor="#fff" color="#242424" border onClick={reorderHandler}>
          할인쿠폰받고 재주문하기
        </Button>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding: 24px;
`;

export default SubsBottomBtn;
