import { editDeliveryDateApi, getOrderDetailApi } from '@api/order';
import SubsCalendar from '@components/Calendar/subscription/SubsCalendar';
import SubsDateMngCalendar from '@components/Calendar/subscription/SubsDateMngCalendar';
import { TextB2R, TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import useSubDeliveryDates from '@hooks/subscription/useSubDeliveryDates';
import { IOrderDetail } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_SUBS_MANAGE, subscriptionForm } from '@store/subscription';
import { fixedBottom, FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOrderDetail } from 'src/queries/order';
import styled from 'styled-components';

interface IProps {
  item: any;
  setToggleState: any;
}
const SubsDeliveryChangeSheet = ({ item, setToggleState }: IProps) => {
  // TODO(young) : 임시로 subscription/set-info에서 캘린더 선택에서 등록한 데이터 사용 추후 교체 해야됨
  const dispatch = useDispatch();
  const router = useRouter();
  const [detailId, setDetailId] = useState<number>();
  const [changeDate, setChangeDate] = useState('날짜 선택');
  const [selectDate, setSelectDate] = useState<Date | undefined>();
  const [deliveryComplete, setDeliveryComplete] = useState(['2022-06-20']);
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      setToggleState(false);
    };
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query?.detailId));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectDate) {
      setChangeDate(dateFormat(selectDate));
    }
  }, [selectDate]);

  const { data: orderDetail, isLoading } = useGetOrderDetail(['getOrderDetail', 'subscription', detailId], detailId!, {
    onSuccess: (data: IOrderDetail) => {
      let completeArr: any = [];
      data.orderDeliveries.forEach((o) => {
        if (o.status === 'COMPLETED') {
          completeArr.push(o.deliveryDate);
        }
      });
      setDeliveryComplete(completeArr);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!detailId,
  });

  const subDates = useSubDeliveryDates();

  const { mutate: changeDeliveryDateMutation } = useMutation(
    async () => {
      const { data } = await editDeliveryDateApi({
        deliveryId: item.id,
        selectedDeliveryDay: dayjs(selectDate).format('YYYY-MM-DD'),
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['getOrderDetail', 'subscription', detailId]);
        dispatch(SET_SUBS_MANAGE({ changeDate: dayjs(selectDate).format('YYYY-MM-DD') }));
      },
      onError: async (error: any) => {
        dispatch(
          SET_ALERT({
            alertMessage: error.message,
            submitBtnText: '확인',
          })
        );
      },
    }
  );

  const dateFormat = (date: Date | string) => {
    return `${dayjs(date).format('M')}월 ${dayjs(date).format('D')}일 (${dayjs(date).format('dd')})`;
  };

  const deliveryChangeHandler = () => {
    // 선택한 배송이 DELIVERING 상태
    if (item?.status === 'DELIVERING') {
      dispatch(
        SET_ALERT({
          alertMessage: `현재 배송 중인 날짜입니다.`,
          submitBtnText: '확인',
        })
      );

      return;
    }
    // 선택한 배송이 DELIVERING 상태
    if (item?.status === 'PREPARING') {
      dispatch(
        SET_ALERT({
          alertMessage: `현재 상품준비 중인 날짜입니다.`,
          submitBtnText: '확인',
        })
      );

      return;
    }

    if (item?.deliveryDateChangeMaximum - item?.deliveryDateChangeCount === 0) {
      dispatch(
        SET_ALERT({
          alertMessage: `배송일 변경 제한 횟수(5회)를\n초과하여 더 이상 변경할 수 없어요.`,
          submitBtnText: '확인',
        })
      );

      return;
    }

    if (item?.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) {
      dispatch(
        SET_ALERT({
          alertMessage: `변경 전 날짜로\n배송일을 변경할 수 없어요.`,
          submitBtnText: '확인',
        })
      );
      return;
    }

    // 변경전 날짜가 합배송이 아닐경우
    if (
      subDates.findIndex((x: any) => x.deliveryDate === item.deliveryDate) === -1 &&
      orderDetail?.orderDeliveries.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) ===
        -1
    ) {
      dispatch(
        SET_ALERT({
          alertMessage: `배송일을 변경하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            changeDeliveryDateMutation();
            dispatch(INIT_BOTTOM_SHEET());
          },
        })
      );
    }

    // 변경전 날짜가 합배송이 아닐경우 && 변경날짜가 배송예정일인 경우
    if (
      subDates.findIndex((x: any) => x.deliveryDate === item.deliveryDate) === -1 &&
      orderDetail?.orderDeliveries.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) !==
        -1
    ) {
      dispatch(
        SET_ALERT({
          alertMessage: `다른 회차의 배송예정일로 변경 시\n기존 주문과는 별도로 배송됩니다.`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            changeDeliveryDateMutation();
            dispatch(INIT_BOTTOM_SHEET());
          },
        })
      );
    }

    // 변경전 날짜가 합배송이 맞을경우
    if (
      subDates.find((x: any) => x.deliveryDate === item.deliveryDate) &&
      orderDetail?.orderDeliveries.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) !==
        -1
    ) {
      dispatch(
        SET_ALERT({
          alertMessage: `다른 회차의 배송예정일로 변경 시\n함께배송 주문도 함께 변경되며,\n기존 주문과는 별도로 배송됩니다.`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            changeDeliveryDateMutation();
            dispatch(INIT_BOTTOM_SHEET());
          },
        })
      );
    }

    // 변경전 날짜가 합배송이 맞을경우 && 변경날짜가 배송예정일인 경우
    if (
      subDates.find((x: any) => x.deliveryDate === item.deliveryDate) &&
      orderDetail?.orderDeliveries.findIndex((x: any) => x.deliveryDate === dayjs(selectDate).format('YYYY-MM-DD')) ===
        -1
    ) {
      dispatch(
        SET_ALERT({
          alertMessage: `함께배송 주문도 함께 변경됩니다.\n변경하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            dispatch(INIT_BOTTOM_SHEET());
          },
        })
      );
    }
    // dispatch(INIT_BOTTOM_SHEET());
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <Container>
      <Header>
        <TextH4B>배송일 변경</TextH4B>
        <CloseBtn
          onClick={() => {
            dispatch(INIT_BOTTOM_SHEET());
          }}
        >
          <SVGIcon name="defaultCancel24" />
        </CloseBtn>
      </Header>
      <RemainCountBox>
        <TextB2R>
          배송일 변경 잔여 횟수 : <b>{item?.deliveryDateChangeMaximum - item?.deliveryDateChangeCount}회</b>
        </TextB2R>
      </RemainCountBox>
      <DateChangeDayBox>
        <li>
          <TextB3R padding="0 0 4px">배송 {item?.deliveryRound ?? 1}회차 - 변경 전</TextB3R>
          <TextH4B>{dateFormat(item.deliveryDate)}</TextH4B>
        </li>
        <li>
          <TextB3R padding="0 0 4px">배송 {item?.deliveryRound ?? 1}회차 - 변경 후</TextB3R>
          <TextH4B>{changeDate}</TextH4B>
        </li>
      </DateChangeDayBox>

      {orderDetail && (
        <SubsDateMngCalendar
          orderDeliveries={orderDetail?.orderDeliveries}
          firstDeliveryDate={orderDetail?.orderDeliveries[0].deliveryDate!}
          lastDeliveryDate={orderDetail?.orderDeliveries[orderDetail?.orderDeliveries.length - 1].deliveryDate!}
          setSelectDate={setSelectDate}
          megCalendarSelectDate={item?.deliveryDate}
          deliveryComplete={deliveryComplete}
          sumDelivery={subDates}
          deliveryChangeBeforeDate={item.deliveryDate}
        />
      )}
      <FlexRow className="sumEx" padding="8px 24px 0">
        <SVGIcon name="brandColorDot" />
        <TextB3R color="#717171" margin="0 0 0 6px">
          함께배송이 있는 배송예정일
        </TextB3R>
      </FlexRow>
      <DateChangeExBox>
        <TextH5B padding="0 0 16px">배송일 변경 안내</TextH5B>
        <TextB3R className="ex">품절이나 시즌오프 등의 상품은 기간 제한이 있을 수 있습니다.</TextB3R>
        <TextB3R className="ex">합배송 상품의 경우 함께 이동됩니다.</TextB3R>
      </DateChangeExBox>
      <BottomButton disabled={selectDate ? false : true} onClick={deliveryChangeHandler}>
        <TextH5B>배송일 변경하기</TextH5B>
      </BottomButton>
    </Container>
  );
};
export const Container = styled.div`
  height: calc(100vh - 56px);
  overflow-y: scroll;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 56px;
`;
export const CloseBtn = styled.button`
  padding: 0;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const RemainCountBox = styled.div`
  padding: 16px 0;
  b {
    font-weight: bold;
  }
`;

const DateChangeDayBox = styled.ul`
  display: flex;
  li {
    width: 50%;
    background-color: #35ad73;
    color: #fff;
    padding: 16px 0 16px 24px;
    &:first-of-type {
      border-right: 0.5px solid #fff;
    }
    &:last-of-type {
      border-left: 0.5px solid #fff;
    }
  }
`;

const DateChangeExBox = styled.div`
  padding: 24px 24px 35px;
  .ex {
    padding-left: 18px;
    position: relative;
    &::before {
      content: '';
      width: 3px;
      height: 3px;
      background-color: #242424;
      position: absolute;
      border-radius: 3px;
      top: 50%;
      transform: translateY(-50%);
      left: 8px;
    }
  }
`;
const BottomButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  background-color: ${theme.black};
  color: #fff;
  &:disabled {
    background-color: ${theme.greyScale6};
    color: ${theme.greyScale25};
  }
`;
export default SubsDeliveryChangeSheet;
