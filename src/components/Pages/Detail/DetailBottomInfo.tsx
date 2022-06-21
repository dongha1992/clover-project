import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';

interface IProps {
  menuDescription?: string;
}

const DetailBottomInfo = ({ menuDescription }: IProps) => {
  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: menuDescription! }}></div>
    </Container>
  );
};

const Container = styled.pre`
  padding: 24px;
`;
export default DetailBottomInfo;
