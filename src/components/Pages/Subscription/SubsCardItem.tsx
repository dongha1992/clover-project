import { getOrderDetailApi } from '@api/order';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_UNPAID_STATUS } from '@constants/subscription';
import { theme } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const SubsCardItem = ({ item }: any) => {
  const today = Number(dayjs().format('YYYYMMDD'));
  const [card, setCard] = useState<any>();

  const {
    data: subsDetail,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getOrderDetail', item.id],
    async () => {
      const { data } = await getOrderDetailApi(item.id);

      return data.data;
    },
    {
      enabled: !!item,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    for (let i = 0; i < item.orderDeliveries.length; i++) {
      item.orderDeliveries[i].deliveryRound = i + 1;
      if (item.orderDeliveries[i].status !== 'COMPLETED') {
        setCard(item.orderDeliveries[i]);
        break;
      }
    }
  }, []);

  if (isLoading) return <div>로딩중</div>;

  return (
    <CardBox>
      <Content>
        <LabelList>
          <Label className="subs">{subsDetail?.subscriptionPeriod === 'UNLIMITED' ? '정기구독' : '단기구독'}</Label>
          <Label className={subsDetail?.delivery}>{DELIVERY_TYPE_MAP[subsDetail?.delivery!]}</Label>
          {subsDetail?.delivery === 'SPOT' && <Label>{DELIVERY_TIME_MAP[subsDetail?.deliveryDetail]}</Label>}
        </LabelList>
        <TextH5B className="name">{subsDetail?.name}</TextH5B>
        {subsDetail?.subscriptionPeriod === 'UNLIMITED' ? (
          <TextB3R className="deliveryInfo">
            <b>
              {subsDetail.status === 'UNPAID' &&
                `${SUBSCRIPTION_UNPAID_STATUS[card?.status]} ${subsDetail?.subscriptionRound}회차`}
              {subsDetail.status === 'PROGRESS' &&
                `${SUBSCRIPTION_STATUS[card?.status]} (배송 ${card.deliveryRound}회차)`}
            </b>{' '}
            - {getFormatDate(card?.deliveryDate)} 도착예정
          </TextB3R>
        ) : (
          <TextB3R className="deliveryInfo">
            <b>
              {SUBSCRIPTION_STATUS[card?.status]} (배송 {card.deliveryRound}회차)
            </b>{' '}
            - {getFormatDate(card?.deliveryDate)} 도착예정
          </TextB3R>
        )}
      </Content>
      <SvgBox>
        <SVGIcon name="arrowRight" />
      </SvgBox>
    </CardBox>
  );
};
const CardBox = styled.div`
  cursor: pointer;
  display: flex;
  width: 312px;
  height: 124px;
  border-radius: 8px;
  padding: 0 22px 0 24px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
`;
const Content = styled.div`
  height: 100%;
  padding-top: 24px;
  .name {
    padding-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .deliveryInfo {
    b {
      font-weight: bold;
    }
  }
`;
const SvgBox = styled.div`
  padding-left: 16px;
`;
const LabelList = styled.div`
  display: flex;
  padding-bottom: 8px;
`;
export const Label = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: -0.4px;
  width: 51px;
  height: 24px;
  margin-right: 4px;
  border-radius: 4px;
  border: 1px solid ${theme.brandColor};
  color: ${theme.brandColor};
  background-color: #fff;
  &:last-child {
    margin-right: 0;
  }
  &.subs {
    background-color: #ebf7f1;
    color: ${theme.brandColor};
    border: none;
  }
  &.dawn,
  &.MORNING {
    border: 1px solid #7922bc;
    color: #7922bc;
  }
  &.parcel,
  &.PARCEL {
    border: 1px solid #1e7ff0;
    color: #1e7ff0;
  }
`;

export default SubsCardItem;
