import React, { ReactChild } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { textH6, textBody3, theme } from '@styles/theme';

interface IProps {
  content: string;
}

/* TODO: CSS 현재 이용약관 기준이라 확장성 고려 나중에 수정해야함 */

const MarkdownRender = ({ content }: IProps) => {
  if (!content) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // strikethrough, tables, tasklists and URLs를 지원하기 위한 plugin
        children={content} // database로 부터 받아와서 설정할 soruce
        skipHtml={false} // 기본값으로 true가 설정되어있다. markdown source안에서 html태그를 무시하지 않도록 false로 option변경
        components={{ a: LinkRenderer }} // https://stackoverflow.com/questions/57513860/react-16-9-0-javascript-href-alternative 이슈
      />
    </Container>
  );
};

const LinkRenderer = (props: any) => {
  return (
    <a
      href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B5%AD%EA%B0%80%EB%B3%B4%EC%95%88%EB%B2%95"
      target="_blank"
    >
      {props.children}
    </a>
  );
};

const Container = styled.div`
  color: ${theme.greyScale65};
  white-space: pre-wrap;
  > h2 {
    ${textH6}
  }
  > h3 {
    ${textBody3}
  }
  > p {
    ${textBody3}
  }
  > ol {
    ${textBody3}
    > li {
      ${textBody3}
      p {
        ${textBody3}
      }
    }
  }
  > ul {
    ${textBody3}
  }
`;

export default React.memo(MarkdownRender);
