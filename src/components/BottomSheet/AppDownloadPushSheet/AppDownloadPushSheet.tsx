import React from 'react';
import styled from 'styled-components';
import { TextH6B, TextH4B } from '@components/Shared/Text';
import { theme, textH5 } from '@styles/theme';
import NextImage from 'next/image';
import Link from 'next/link';

interface IProps {
  closeHandler: () => void;
  href: string;
}

const AppDownloadPushSheet = ({href, closeHandler}: IProps): JSX.Element => {
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
        <Link href={href} passHref> 
          <Button>
            앱으로 볼래요
          </Button>
        </Link>
        <TextH6B
          onClick={closeHandler}
          pointer 
          padding='16px 0 0 0' 
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

const Button = styled.div`
  width: 100%;
  height: 48px;
  color: ${theme.white};
  background: ${theme.black};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  ${textH5};
  cursor: pointer;
`;

export default AppDownloadPushSheet;
