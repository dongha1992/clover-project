import React from 'react';
import styled from 'styled-components';

type TProps = {
  content: JSX.Element;
};

const Content = ({ content }: TProps) => {
  return <ContentContainer>{content}</ContentContainer>;
};

const ContentContainer = styled.div`
  width: 100%;
`;
export default React.memo(Content);
