import { getOrderDetailApi } from '@api/order';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import SubsStatusTooltip from '@components/Shared/Tooltip/SubsStatusTooltip';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_UNPAID_STATUS } from '@constants/subscription';
import { useSubsStatusMsg } from '@hooks/subscription/useSubsStatusMsg';
import { theme } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import { last } from 'lodash-es';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const SubsCardItem = ({ item }: any) => {
  const today = Number(dayjs().format('YYYYMMDD'));
  const [cards, setCards] = useState<any>([]);
  const [subsType, setSubsType] = useState<'UNLIMITED' | 'LIMITED'>();
  const [limitedCompleted, setLimitedCompleted] = useState<boolean>();

  useEffect(() => {
    if (item?.subscriptionPeriod === 'UNLIMITED') {
      setSubsType('UNLIMITED');
    } else {
      item.orderDeliveries[item.orderDeliveries.length - 1].status === 'COMPLETED'
        ? setLimitedCompleted(true)
        : setLimitedCompleted(false);
      setSubsType('LIMITED');
    }
  }, [item?.subscriptionPeriod]);

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < item.orderDeliveries.length; i++) {
      if (item.currentDeliveryDate === item.orderDeliveries[i].deliveryDate || !item.currentDeliveryDate) {
        arr.push(item.orderDeliveries[i]);
      }

      setCards(arr);
    }
  }, []);

  const msg = useSubsStatusMsg(item);

  const cardClickHandler = () => {
    if (limitedCompleted) {
      router.push({ pathname: '/subscription/set-info' });
    }
  };

  return (
    <CardBox onClick={cardClickHandler}>
      {msg && (
        <TooltipWrapper>
          <SubsStatusTooltip message={msg!} />
        </TooltipWrapper>
      )}
      <Content>
        <LabelList>
          <Label className="subs">{subsType === 'UNLIMITED' ? '정기구독' : '단기구독'}</Label>
          <Label className={item?.delivery}>{DELIVERY_TYPE_MAP[item?.delivery!]}</Label>
          {item?.delivery === 'SPOT' && <Label>{DELIVERY_TIME_MAP[item?.deliveryDetail]}</Label>}
        </LabelList>
        <TextH5B className="name">{item?.name}</TextH5B>
        {subsType === 'UNLIMITED' ? (
          <TextB3R className="deliveryInfo">
            <b>
              {item.status === 'UNPAID' &&
                `${SUBSCRIPTION_UNPAID_STATUS[cards[0]?.status]} ${item?.subscriptionRound}회차`}
              {item.status === 'PROGRESS' &&
                `${SUBSCRIPTION_STATUS[cards[0]?.status]} (배송 ${cards
                  .map((item: any) => item.deliveryRound)
                  .sort()}회차)`}
            </b>{' '}
            - {getFormatDate(cards[0]?.deliveryDate)} 도착예정
          </TextB3R>
        ) : limitedCompleted ? (
          <TextB3R color="#35AD73">할인쿠폰 받고 지금 바로 재구매하러 가기!</TextB3R>
        ) : (
          <TextB3R className="deliveryInfo">
            <b>
              {SUBSCRIPTION_STATUS[cards[0]?.status]} (배송 {cards[0]?.deliveryRound}회차)
            </b>{' '}
            - {getFormatDate(cards[0]?.deliveryDate)} 도착예정
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
  position: relative;
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

const TooltipWrapper = styled.div`
  position: absolute;
  top: -15px;
  left: 24px;
`;

export default SubsCardItem;
