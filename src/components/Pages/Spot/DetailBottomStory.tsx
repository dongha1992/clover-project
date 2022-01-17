import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import Tag from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import {SET_IMAGE_VIEWER} from '@store/common';
import { IMAGE_S3_URL } from '@constants/mock/index';
import {ISpotsDetail} from '@pages/spot/detail/[id]';
import { getSpotsDetailStory } from '@api/spot';

interface IProps {
    id: number;
};

interface ISpotStories {
    id: number;
    spotId: number;
    type: string;
    title: string;
    content: string;
    createdAt: string;
    liked: boolean;
    likeCount: number;
};

const DetailBottomStory = ( {id}:IProps ): ReactElement => {
  const dispatch = useDispatch();
  const [stories, setStories] = useState<ISpotStories[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsLeng = 0;
  // items&&items.stories?.length > 0;
  const openImgViewer =  (img: any) => {
    dispatch(SET_IMAGE_VIEWER(img));
  };

  useEffect(()=> {
    const getData = async() => {
      try{
        const {data} = await getSpotsDetailStory(id, page);
        setStories(data?.data.spotStories);
        console.log('data', data.data.spotStories)
      }catch(err){
        if(err)
        console.error(err);
      };
    }
      getData();
  }, []);
    
    

  return (
    <>
      {itemsLeng ? (
        <StoryContainer>
          {stories?.map((item, index: number) => {
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
                {/* {item.images.length > 0 && (
                  item.images.map((url, idx)=> {
                    <ImgWrapper key={idx} src={`${IMAGE_S3_URL}${url}`} onClick={()=>openImgViewer(url)}  alt="스토리 이미지" />
                  })
                )} */}
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
