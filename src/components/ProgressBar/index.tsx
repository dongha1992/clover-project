import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

function ProgressBar({}) {
  return (
    <Outter>
      <Inner />
    </Outter>
  );
}

const Outter = styled.div`
  height: 10px;
  background-color: ${theme.greyScale6};
  border-radius: 8px;
`;

const Inner = styled.div`
  width: 50%;
  height: 100%;
  border-radius: 8px;
  background-color: ${theme.brandColor};
`;
export default ProgressBar;
