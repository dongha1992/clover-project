import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  firstDeliveryDate: string;
}

const SubsUnpaidBoard = ({ firstDeliveryDate }: IProps) => {
  const [regularPaymentDate, setRegularPaymentDate] = useState<string>();

  useEffect(() => {
    const year = dayjs(firstDeliveryDate).format('YYYY');
    if ([30, 31, 1, 2].includes(Number(dayjs(firstDeliveryDate).format('DD')))) {
      //첫 구독시작일이 [30일, 31일, 1일, 2일]일때 자동결제일: 27일
      const month = dayjs(firstDeliveryDate).subtract(1, 'month').format('M');
      const dd = dayjs(`${year}-${month}-27`).format('dd');
      setRegularPaymentDate(`${month}월 27일 (${dd})`);
    } else {
      //첫 구독시작일이 3일 ~ 29일 이면 자동결제일: D-2
      const month = dayjs(firstDeliveryDate).format('M');
      const day = dayjs(firstDeliveryDate).subtract(2, 'day').format('DD');
      const dd = dayjs(`${year}-${month}-${day}`).format('dd');
      setRegularPaymentDate(`${month}월 ${day}일 (${dd})`);
    }
  }, [firstDeliveryDate]);

  return (
    <BoardContainer>
      <TextB2R>
        <b>{regularPaymentDate}</b> 결제될 구독 식단을 확인해 주세요.
      </TextB2R>
    </BoardContainer>
  );
};
const BoardContainer = styled.div`
  background-color: ${theme.brandColor3p};
  margin-top: 15px;
  border-radius: 8px;
  padding: 16px;
  b {
    color: ${theme.brandColor};
    font-weight: bold;
  }
`;
export default SubsUnpaidBoard;
