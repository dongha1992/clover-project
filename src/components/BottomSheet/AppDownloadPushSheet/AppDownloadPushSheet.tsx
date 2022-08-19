import React from 'react';
import styled from 'styled-components';
import { TextH6B, TextH4B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import NextImage from 'next/image';
import { useDispatch } from 'react-redux';

interface IProps {
  onClick: () => void;
  closeHandler: () => void;
}

const AppDownloadPushSheet = ({onClick, closeHandler}: IProps) => {

  return (
    <Container>
      <Wrapper>
        <ImageWrapper>
          <NextImage 
            src='/images/ic_fco_app_rounded.png'
            alt="프레시코드 아이콘"
            width='48px'
            height='48px'
            layout="responsive"
            className='fco-icon'
          />
        </ImageWrapper>
        <TextH4B center padding='16px 0 16px 0'>{'프레시코드 앱 다운로드 받고\n더 많은 혜택 얻어 가세요'}</TextH4B>
        <Button
          onClick={onClick}
          color={theme.white}
          backgroundColor={theme.black}
        >
          앱으로 볼래요
        </Button>
        <TextH6B
          onClick={closeHandler}
          pointer 
          padding='8px 0 0 0' 
          color={theme.greyScale65} 
          textDecoration='underline'
        >
          그냥 웹으로 볼래요
        </TextH6B>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 52px;
`;

export default AppDownloadPushSheet;
