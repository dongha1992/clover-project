import React from 'react';
import { getCustomDate } from '@utils/destination';
import { TextH6B } from '@components/Shared/Text';
import { ILunchOrDinner } from '@model/index';

interface IProps {
  selectedDeliveryDay: string;
  selectedTime?: string;
  delivery: string;
}

const deliveryTimeInfoRenderer = ({ selectedDeliveryDay, selectedTime, delivery }: IProps) => {
  const { dates }: { dates: number } = getCustomDate(new Date(selectedDeliveryDay));
  const today: number = new Date().getDate();
  const selectToday = dates === today;

  try {
    switch (delivery) {
      case 'parcel': {
        return <TextH6B>{`${dates}일 도착`}</TextH6B>;
      }
      case 'morning': {
        return <TextH6B>{`${dates}일 새벽 7시 전 도착`}</TextH6B>;
      }
      case 'quick':
      case 'spot': {
        if (selectToday) {
          return <TextH6B>{`오늘 ${selectedTime} 전 도착`}</TextH6B>;
        } else {
          return <TextH6B>{`${dates}일 ${selectedTime} 전 도착`}</TextH6B>;
        }
      }
      default:
        return '';
    }
  } catch (error) {
    console.error(error);
  }
};

export default deliveryTimeInfoRenderer;
