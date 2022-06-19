import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
interface IProps {
  menuDescription: string;
}

const DetailBottomInfo = ({ menuDescription }: IProps) => {
  return (
    <Container>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // strikethrough, tables, tasklists and URLs를 지원하기 위한 plugin
        skipHtml={false} // 기본값으로 true가 설정되어있다. markdown source안에서 html태그를 무시하지 않도록 false로 option변경
      >
        {menuDescription}
      </ReactMarkdown>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;
export default DetailBottomInfo;
