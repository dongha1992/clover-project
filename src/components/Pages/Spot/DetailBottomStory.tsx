import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import Tag from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import {SET_IMAGE_VIEWER} from '@store/common';
import { IMAGE_S3_URL } from '@constants/mock/index';
import {ISpotsDetail} from '@pages/spot/detail/[id]';

interface IProps {
    items: ISpotsDetail;
}

const DetailBottomStory = ( {items}: IProps): ReactElement => {
  const dispatch = useDispatch();
  const itemsLeng = items&&items.stories?.length > 0;
  const openImgViewer =  (img: any) => {
    dispatch(SET_IMAGE_VIEWER(img));
  };

  return (
    <>
      {itemsLeng ? (
        <StoryContainer>
          {items?.stories?.map((item, index: number) => {
            return (
              <TopWrapper key={index}>
                <FlexBetween>
                  <TextH4B>{item.title}</TextH4B>
                  <Tag
                    color={theme.brandColor}
                    backgroundColor={theme.brandColor5}
                  >
                    {item.type}
                  </Tag>
                </FlexBetween>
                <TextB2R margin="0 0 8px 0">{item.createdAt}</TextB2R>
                {item.images.length > 0 && (
                  item.images.map((url, idx)=> {
                    <ImgWrapper key={idx} src={`${IMAGE_S3_URL}${url}`} onClick={()=>openImgViewer(url)}  alt="스토리 이미지" />
                  })
                )}
                <TextB1R margin="10px 0">{item.content}</TextB1R>
                <LikeWrapper>
                  <SVGIcon name={item.liked ? 'likeRed18' : 'likeBorderGray'} />
                  <TextB2R>{item.likeCount}</TextB2R>
                </LikeWrapper>
                <UnderLine />
              </TopWrapper>
            );
          })}
        </StoryContainer>
      )
      :(
        <Container>
          <TextB1R color={theme.greyScale65}>아직 스토리가 없어요.😭</TextB1R>
        </Container>
      )
      }
    </>
  );
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
`;
const TopWrapper = styled.div``;

const ImgWrapper = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

const LikeWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: start;
`;

const UnderLine = styled.ul`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
`;

export default DetailBottomStory;
