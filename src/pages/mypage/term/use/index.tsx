import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import TermSheet from '@components/BottomSheet/TermSheet';
import { theme } from '@styles/theme';
import { terms } from '@api/term';
import { ITerm } from '@model/index';
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TermOfUsePage = () => {
  const [termOfUser, setTermOfUse] = useState<ITerm>();
  const dispatch = useDispatch();

  const getTerms = async () => {
    const params = {
      type: 'USE',
    };
    const { data } = await terms(params);
    setTermOfUse(data.data);
  };

  const clickInputHandler = () => {
    dispatch(
      setBottomSheet({
        content: <TermSheet title="이용약관" />,
        buttonTitle: '선택하기',
      })
    );
  };

  useEffect(() => {
    getTerms();
  }, []);

  const formatDate = termOfUser?.terms.createdAt.split(' ')[0];
  const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;
  return (
    <Container>
      <Wrapper>
        <InputWrapper>
          <TextInput value={formatDate} />
          <div className="svgWrapper" onClick={clickInputHandler}>
            <SVGIcon name="triangleDown" />
          </div>
        </InputWrapper>
        <ReactMarkDown>{markdown}</ReactMarkDown>
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

export default TermOfUsePage;
