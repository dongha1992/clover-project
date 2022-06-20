import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';

interface IProps {
  menuDescription?: string;
}

const DetailBottomInfo = ({ menuDescription }: IProps) => {
  return <Container dangerouslySetInnerHTML={{ __html: menuDescription! }}></Container>;
};

const Container = styled.div`
  padding: 24px;
`;
export default DetailBottomInfo;
