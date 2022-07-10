import { TextB3R, TextH5B } from '@components/Shared/Text';
import SubsStatusTooltip from '@components/Shared/Tooltip/SubsStatusTooltip';
import useSubsNowDeliveryInfo from '@hooks/subscription/useSubsNowDeliveryInfo';
import useSubsPaymentFail from '@hooks/subscription/useSubsPaymentFail';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import router from 'next/router';
import styled from 'styled-components';
import SubsLabel from './SubsLabel';

const SubsCardItem = ({ item }: any) => {
  const { deliveryInfo } = useSubsNowDeliveryInfo(item);
  const { tooltipMsg } = useSubsPaymentFail(
    item?.unsubscriptionType,
    item.isSubscribing,
    item.lastDeliveryDateOrigin,
    item.subscriptionPeriod,
    item.status
  );

  const cardClickHandler = () => {
    if (item?.subscriptionPeriod !== 'UNLIMITED' && item.status === 'COMPLETED') {
      // 단기구독 완료일때 재주문 CTA
      router.push({ pathname: '/subscription/set-info' });
    } else {
      router.push(`/subscription/${item.id}`);
    }
  };

  return (
    <CardBox onClick={cardClickHandler}>
      {tooltipMsg && (
        <TooltipWrapper>
          <SubsStatusTooltip message={tooltipMsg!} />
        </TooltipWrapper>
      )}
      <Content>
        <LabelList>
          <SubsLabel
            subsPeriod={item.subscriptionPeriod}
            delivery={item.delivery}
            deliveryDetail={item.deliveryDetail}
          />
        </LabelList>
        <TextH5B className="name">{item?.name}</TextH5B>
        {item?.subscriptionPeriod !== 'UNLIMITED' && item.status === 'COMPLETED' ? (
          <TextB3R color="#35AD73">할인쿠폰 받고 지금 바로 재구매하러 가기!</TextB3R>
        ) : (
          <TextB3R className="deliveryInfo">
            <b>
              {deliveryInfo.status} {deliveryInfo.round}
            </b>{' '}
            - {deliveryInfo.deliveryDate}
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
  padding-left: 0px;
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
