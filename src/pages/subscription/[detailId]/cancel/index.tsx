import RefundTotalPriceBox from '@components/Pages/Order/Refund/RefundTotalPriceBox';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { IResponse } from '@model/index';
import { useDeleteOrderCancel, useDeleteOrderCancelPreview } from '@queries/order';
import { SET_ALERT } from '@store/alert';
import { fixedBottom, theme } from '@styles/theme';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const OrderCancelPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [detailId, setDetailId] = useState<any>();
  const { mutate: deleteOrderCancel } = useDeleteOrderCancel(['deleteOrderCancel'], {
    onSuccess: (data) => {
      console.log('success', data);
      router.push(`/subscription/${detailId}/cancel/complete`);
    },
    onError: (error: IResponse | any) => {
      dispatch(
        SET_ALERT({
          alertMessage: `${error.message}`,
        })
      );
    },
  });

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query.detailId));
    }
  }, [router.isReady, router.query.detailId]);

  const { data: cancelPrivew, isLoading } = useDeleteOrderCancelPreview(['deleteOrderCancelPreview'], detailId!, {
    enabled: !!detailId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const orderCancelHandler = () => {
    dispatch(
      SET_ALERT({
        alertMessage: `남은 회차 주문이 전체 취소됩니다.\n주문을 취소하시겠어요?`,
        alertSubMessage: `(사용 기한이 만료된 포인트, 쿠폰은\n환불 후 바로 만료될 수 있어요.)`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => {
          deleteOrderCancel(detailId!);
        },
      })
    );
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <OrderCancelContainer>
      <div className="titleBox">
        <TextH4B padding="0 0 8px">환불정보</TextH4B>
        <TextB2R color={theme.greyScale65}>취소 가능 시간이 지난 회차는 환불에서 제외됩니다.</TextB2R>
      </div>
      <div className="refundInfoWrapper">
        <RefundTotalPriceBox cancelPrivew={cancelPrivew} />
      </div>
      <div className="confirmMentBox">
        <TextH5B color={theme.greyScale65} padding="0 0 16px 0">
          주문취소 시 반드시 확인해주세요!
        </TextH5B>
        <ul>
          <li>
            <TextB3R color={theme.greyScale65}>
              취소를 진행하면 남은 회차(상품 준비가 시작되기 전 주문완료 상태) 전체가 취소됩니다.
            </TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>
              주문취소 시 포인트 또는 쿠폰의 사용 기한이 만료된 경우 환불 후 바로 만료될 수 있습니다.
            </TextB3R>
          </li>
          <li>
            <TextB3R color={theme.greyScale65}>
              정기구독의 경우 다음 구독도 자동으로 해지되며 구독기간에 따른 추가혜택을 받을 수 없습니다.
            </TextB3R>
          </li>
        </ul>
      </div>
      <BtnWrapper>
        <Button height="100%" onClick={orderCancelHandler}>
          주문 취소하기
        </Button>
      </BtnWrapper>
    </OrderCancelContainer>
  );
};
const OrderCancelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  .titleBox {
    padding: 24px;
  }
  .refundInfoWrapper {
    padding: 0 24px 24px;
  }
  .confirmMentBox {
    padding: 24px 24px 0 24px;
    background-color: ${theme.greyScale3};
    flex: 1;
    ul {
      padding-top: 16px;
      padding-bottom: 42px;
      border-top: 1px solid ${theme.greyScale6};
      li {
        position: relative;
        padding-left: 17px;
        padding-bottom: 4px;
        word-break: keep-all;
        &:last-of-type {
          padding-bottom: 0;
        }
        &::after {
          content: '';
          width: 3px;
          height: 3px;
          border-radius: 3px;
          background-color: ${theme.greyScale65};
          position: absolute;
          top: 7px;
          left: 7px;
        }
      }
    }
  }
`;

export const BtnWrapper = styled.div`
  ${fixedBottom}
  display: flex;
`;

export default OrderCancelPage;
