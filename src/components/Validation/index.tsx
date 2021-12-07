import React from 'react';
import { TextB3R } from '@components/Text';
import { theme } from '@styles/theme';

interface IProps {
  children: React.ReactNode;
}
function Validation({ children }: IProps) {
  return (
    <TextB3R padding="2px 0 0 16px" color={theme.systemRed}>
      {children}
    </TextB3R>
  );
}

export default React.memo(Validation);
