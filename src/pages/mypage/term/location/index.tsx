import React from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import SVGIcon from '@utils/SVGIcon';
import { setBottomSheet } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { TermSheet } from '@components/BottomSheet/TermSheet';
import { homePadding, theme } from '@styles/theme';

const LocationTermPage = () => {
  const DATE = '2021-22-22';

  const dispatch = useDispatch();

  const clickInputHandler = () => {
    dispatch(
      setBottomSheet({
        content: <TermSheet title="위치정보 서비스 이용약관" />,
      })
    );
  };
  return (
    <Container>
      <Wrapper>
        <InputWrapper>
          <TextInput value={DATE} />
          <div className="svgWrapper" onClick={clickInputHandler}>
            <SVGIcon name="triangleDown" />
          </div>
        </InputWrapper>
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

export default LocationTermPage;
