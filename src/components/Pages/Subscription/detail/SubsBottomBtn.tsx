// import { Button } from '@components/Shared/Button';
import { theme } from '@styles/theme';
import styled from 'styled-components';

interface IProps {
  subscriptionPeriod: string;
  isSubscribing: boolean;
  status: string;
  reorderHandler: () => void;
  orderCancelHandler: () => void;
  canCancel: boolean;
}

const SubsBottomBtn = ({
  subscriptionPeriod,
  isSubscribing,
  status,
  canCancel,
  reorderHandler,
  orderCancelHandler,
}: IProps) => {
  return (
    <Container>
      {/* 정기구독 */}
      {isSubscribing && subscriptionPeriod === 'UNLIMITED' && (status === 'UNPAID' || status === 'RESERVED') && (
        <Button color="#242424" onClick={orderCancelHandler}>
          구독 해지하기
        </Button>
      )}
      {isSubscribing && subscriptionPeriod === 'UNLIMITED' && status === 'PROGRESS' && (
        <Button color="#242424" onClick={orderCancelHandler} disabled={!canCancel}>
          주문 취소하기
        </Button>
      )}
      {!isSubscribing && subscriptionPeriod === 'UNLIMITED' && (status === 'CANCELED' || status === 'COMPLETED') && (
        <Button color="#242424" onClick={reorderHandler}>
          재주문하기
        </Button>
      )}

      {/* 단기구독 */}
      {!isSubscribing &&
        subscriptionPeriod !== 'UNLIMITED' &&
        (status === 'PROGRESS' || status === 'RESERVED' || status === 'UNPAID') && (
          <Button color="#242424" onClick={orderCancelHandler} disabled={!canCancel}>
            주문 취소하기
          </Button>
        )}
      {!isSubscribing && subscriptionPeriod !== 'UNLIMITED' && status === 'CANCELED' && (
        <Button color="#242424" onClick={reorderHandler}>
          재주문하기
        </Button>
      )}
      {!isSubscribing && subscriptionPeriod !== 'UNLIMITED' && status === 'COMPLETED' && (
        <Button color="#242424" onClick={reorderHandler}>
          할인쿠폰받고 재주문하기
        </Button>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding: 24px;
`;

export const Button = styled.button`
  cursor: pointer;
  background-color: #fff;
  color: #242424;
  border: 1px solid #242424;
  width: 100%;
  height: 48px;
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: bold;
  line-height: 22px;
  border-radius: 8px;
  &:disabled {
    border: 1px solid ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;

export default SubsBottomBtn;
