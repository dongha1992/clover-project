import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { TermSheet } from '@components/BottomSheet/TermSheet';
import { theme } from '@styles/theme';
import { terms } from '@api/term';
import { ITerm, IVersion } from '@model/index';
import MarkdownRenderer from '@components/Shared/Markdown';
import { commonSelector } from '@store/common';

export interface IFormatVersion {
  [key: string]: {
    endedAt: string;
    startedAt: string;
    version: number;
  };
}

const TermOfUsePage = () => {
  const [termOfUser, setTermOfUse] = useState<ITerm>();
  const [currentVersion, setCurrentVersion] = useState<number>();

  const dispatch = useDispatch();
  const { versionOfTerm } = useSelector(commonSelector);
  console.log(versionOfTerm, 'versionOfTerm');

  const getTerms = async () => {
    const params = {
      type: 'USE',
    };
    try {
      const { data } = await terms(params);
      setTermOfUse(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const changeVersionHandler = () => {
    dispatch(
      setBottomSheet({
        content: (
          <TermSheet
            title="이용약관"
            versions={termOfUser?.versions!}
            currentVersion={currentVersion || 2}
          />
        ),
      })
    );
  };

  useEffect(() => {
    getTerms();
  }, []);

  const currentVersionOfDate = termOfUser?.terms.startedAt.split(' ')[0];
  const formatDate = `${currentVersionOfDate} (현재)`;

  if (!termOfUser) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper>
        <InputWrapper>
          <CustmInput>
            <TextB2R>{formatDate}</TextB2R>
          </CustmInput>
          <div className="svgWrapper" onClick={changeVersionHandler}>
            <SVGIcon name="triangleDown" />
          </div>
        </InputWrapper>
        <MarkDownWrapper>
          <MarkdownRenderer content={termOfUser?.terms.content!} />
        </MarkDownWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  background-color: ${theme.greyScale3};
  padding: 24px;
`;
const InputWrapper = styled.div`
  position: relative;
  .svgWrapper {
    position: absolute;
    bottom: 40%;
    right: 5%;
  }
`;

const MarkDownWrapper = styled.div`
  padding-top: 24px;
`;

const CustmInput = styled.div`
  padding: 12px 16px;
  border: 1px solid ${theme.greyScale15};
  border-radius: 8px;
`;

export default TermOfUsePage;
