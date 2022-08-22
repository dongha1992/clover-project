import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { TermSheet } from '@components/BottomSheet/TermSheet';
import { theme } from '@styles/theme';
import { terms } from '@api/term';
import { ITerm } from '@model/index';
import MarkdownRenderer from '@components/Shared/Markdown';
import { commonSelector, SET_VERSION_OF_TERM } from '@store/common';
import { getTermDate } from '@utils/getTermDate';
export interface IFormatVersion {
  [key: string]: {
    endedAt: string;
    startedAt: string;
    version: number;
  };
}

const PrivacyPage = () => {
  const [termOfUser, setTermOfUse] = useState<ITerm>();
  const [currentVersion, setCurrentVersion] = useState<number>();

  const { versionOfTerm } = useSelector(commonSelector);
  const dispatch = useDispatch();

  const getTerms = async () => {
    const params = {
      type: 'PRIVACY',
      version: versionOfTerm ?? null,
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
      SET_BOTTOM_SHEET({
        content: (
          <TermSheet title="개인정보 처리방침" versions={termOfUser?.versions!} currentVersion={currentVersion ?? 2} />
        ),
      })
    );
  };

  useEffect(() => {
    getTerms();
    setCurrentVersion(versionOfTerm);
  }, [versionOfTerm]);

  useEffect(() => {
    return () => {
      dispatch(SET_VERSION_OF_TERM(2));
    };
  }, []);

  if (!termOfUser) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper>
        <InputWrapper onClick={changeVersionHandler}>
          <CustmInput>
            <TextB2R>{getTermDate({ currentVersion, termOfUser })}</TextB2R>
          </CustmInput>
          <div className="svgWrapper">
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
  cursor: pointer;
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

export default PrivacyPage;
