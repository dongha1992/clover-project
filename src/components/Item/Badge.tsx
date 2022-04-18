import React from 'react';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import styled from 'styled-components';

interface IProps {
  message: string | boolean;
}

const Badge = ({ message }: IProps) => {
  return (
    <BadgeWrapper message={message}>
      <TextH6B color={theme.white}>{message}</TextH6B>
    </BadgeWrapper>
  );
};

const BadgeWrapper = styled.div<{ message?: string | boolean }>`
  position: absolute;
  display: flex;
  left: 0;
  top: 10%;
  background-color: ${({ message }) => (message === '일시품절' ? theme.black : theme.brandColor)};
  padding: 4px 8px;
  border-radius: 0px 4px 4px 0px;
`;

export default Badge;
