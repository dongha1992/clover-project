import React from 'react';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import styled from 'styled-components';
import { Obj } from '@model/index';

const Badge = ({ status }: any) => {
  const map: Obj = {
    isSoldout: '일시품절',
    isSoon: '2022-02-22 13시 오픈',
    isNew: 'New',
    isBest: 'Best',
  };
  return (
    <BadgeWrapper status={status}>
      <TextH6B color={theme.white}>{map[status]}</TextH6B>
    </BadgeWrapper>
  );
};

const BadgeWrapper = styled.div<{ status?: string }>`
  position: absolute;
  display: flex;
  left: 0;
  top: 10%;
  background-color: ${({ status }) => (status === 'isSoldout' ? theme.black : theme.brandColor)};
  padding: 4px 8px;
  border-radius: 0px 4px 4px 0px;
`;

export default Badge;
