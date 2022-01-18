import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const MarkdownRender = (content: string) => {
  console.log(content);
  return (
    <Container>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Container>
  );
};

const Container = styled.div``;

export default React.memo(MarkdownRender);
