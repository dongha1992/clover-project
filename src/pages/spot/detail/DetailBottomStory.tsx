import React from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Text';
import {theme, FlexBetween} from '@styles/theme';
import Tag from '@components/Tag';
import SVGIcon from '@utils/SVGIcon';

function DetailBottomStory({items}: any) {
  const itemsLeng: number = items?.story?.length;

  return (
    <>
    {
      itemsLeng === 0 
      ?
      <Container>
          <TextB1R color={theme.greyScale65}>아직 스토리가 없어요.😭</TextB1R>
      </Container>
      :
      <StoryContainer>
          {
          items?.story?.map((item: any, index: number) => {
              return (
                <TopWrapper key={index}>
                  <FlexBetween>
                    <TextH4B>{item.spotName}</TextH4B>
                    <Tag color={theme.brandColor} backgroundColor={theme.brandColor5}>{item.noti}</Tag>
                  </FlexBetween>
                  <TextB2R margin='0 0 8px 0'>{item.date}</TextB2R>
                  {
                    item.imgUrl &&
                      <ImgWrapper
                        src={item.imgUrl}
                        alt='스토리 이미지'
                      />
                  }
                  <TextB1R margin='10px 0'>{item.desc}</TextB1R>
                  <LikeWrapper>
                    <SVGIcon name='like' />
                    <TextB2R>{item.like}</TextB2R>
                  </LikeWrapper>
                  <UnderLine />
                </TopWrapper>
              )
            })
          }
      </StoryContainer>
    }
    </>
  )
  
}

const Container = styled.section`
  padding: 24px;
  width: 100%;
  height: 483px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StoryContainer = styled.div`
  padding: 24px;
`
const TopWrapper = styled.div``

const ImgWrapper = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`

const LikeWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: start;
`

const UnderLine = styled.ul`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
`

export default DetailBottomStory;