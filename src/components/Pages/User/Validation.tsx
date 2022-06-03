import React from 'react';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';

interface IProps {
  children: React.ReactNode;
}
const Validation = ({ children }: IProps) => {
  return (
    <TextB3R padding="4px 0 4px 16px" color={theme.systemRed}>
      {children}
    </TextB3R>
  );
};

export default React.memo(Validation);
