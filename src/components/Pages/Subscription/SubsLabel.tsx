import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import { periodMapper } from '@constants/subscription';
import { theme } from '@styles/theme';
import styled from 'styled-components';

interface IProps {
  subsPeriod: string;
  delivery: string;
  deliveryDetail: string;
}
const SubsLabel = ({ subsPeriod, delivery, deliveryDetail }: IProps) => {
  return (
    <>
      <Label className="subs">{subsPeriod === 'UNLIMITED' ? '정기구독' : `${periodMapper[subsPeriod]} 구독`}</Label>
      <Label className={delivery}>{DELIVERY_TYPE_MAP[delivery]}</Label>
      {delivery === 'SPOT' && <Label>{DELIVERY_TIME_MAP[deliveryDetail]}</Label>}
    </>
  );
};

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

export default SubsLabel;
