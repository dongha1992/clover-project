import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { getFormatDate } from '@utils/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  subscriptionPaymentDate: string;
}

const SubsUnpaidBoard = ({ subscriptionPaymentDate }: IProps) => {
  return (
    <BoardContainer>
      <TextB2R>
        <b>{getFormatDate(subscriptionPaymentDate)}</b> 결제될 구독 식단을 확인해 주세요.
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
