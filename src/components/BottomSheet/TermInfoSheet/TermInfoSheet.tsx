import React from 'react';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { homePadding } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import MarkdownRenderer from '@components/Shared/Markdown';
import { Obj } from '@model/index';

interface IProps {
  children: any;
  type: string;
}
const TermInfoSheet = ({ children, type }: IProps) => {
  const dispatch = useDispatch();

  const TITLE_MAP: Obj = {
    PRIVACY: '개인정보 처리방침',
    USE: '이용약관',
    ORDER: '개인정보 수집·이용 동의',
  };
  const initSheetHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Header>
        <div />
        <TextH4B padding="">{TITLE_MAP[type]}</TextH4B>
        <SVGWrapper onClick={initSheetHandler}>
          <SVGIcon name="crossCloseBlack" />
        </SVGWrapper>
      </Header>
      <MarkdownRenderer content={children} />
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 56px);
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 24px 0;
`;
const SVGWrapper = styled.div`
  padding-right: 16px;
  cursor: pointer;
`;

export default TermInfoSheet;
