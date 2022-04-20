import { theme } from '@styles/theme';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  length: number;
  count: number;
}

const SubsProgressBar = ({ length, count }: IProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress((count / length) * 100);
    }, 100);
  }, [count, length]);

  return (
    <Outter>
      <Inner style={{ width: `${progress}%` }} />
    </Outter>
  );
};
const Outter = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${theme.greyScale6};
  border-radius: 10px;
`;
const Inner = styled.div`
  height: 100%;
  border-radius: 8px;
  background-color: ${theme.brandColor};
  transition: all 0.4s;
`;
export default SubsProgressBar;
