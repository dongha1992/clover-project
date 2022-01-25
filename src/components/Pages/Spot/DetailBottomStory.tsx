import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import Tag from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import {SET_IMAGE_VIEWER} from '@store/common';
import { IMAGE_S3_URL } from '@constants/mock/index';
import { 
  postSpotsStoryLike, 
  deleteSpotsStoryLike, 
  getSpotsStoryLike 
} from '@api/spot';
import {ISpotStories} from '@pages/spot/detail/[id]';

interface IProps {
  list: ISpotStories;
};


const DetailBottomStory = ({list}: IProps ): ReactElement => {
  const dispatch = useDispatch();
  const [storyLike, setStoryLike] = useState<boolean>();
  const [likeCount, setLikeCount] = useState(list.likeCount);

  const openImgViewer =  (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  const getStoryLikeData = async() => {
    try{
      const {data} = await getSpotsStoryLike(list.spotId, list.id);
      setStoryLike(data.data.liked);
    }catch(err){
      console.error(err);
    };
  };
  useEffect(()=> {
    getStoryLikeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handlerLike = async () => {
    if(!storyLike){
      try{
        const { data } = await postSpotsStoryLike(list.spotId, list.id);
        if(data.code === 200){
          setStoryLike(true);
          setLikeCount(likeCount + 1);
          console.log('post!')
        }
      }catch(err){
        console.error(err);
      };
    }else if(storyLike){
      try{
        const { data } = await deleteSpotsStoryLike(list.spotId, list.id);
        if(data.code === 200){
          setStoryLike(false);
          setLikeCount(likeCount - 1);
          console.log('delete!')
        }
      }catch(err){
        console.error(err);
      };
    };
  };

  const TagType = () => {
    const type = list?.type;
    switch (type){
      case 'NOTICE':
        return '공지'
      case 'EVENT':
        return '이벤트'
      case 'GENERAL':
        return '일반'
      default:
        return null;
    }
  }

  return (
    <StoryContainer>
      <TopWrapper>
        <FlexBetween>
          <TextH4B>{list?.title}</TextH4B>
          <Tag
            color={theme.brandColor}
            backgroundColor={theme.brandColor5}
          >
            {TagType()}
          </Tag>
        </FlexBetween>
        <TextB2R margin="0 0 8px 0">{list?.createdAt.split(' ')[0]}</TextB2R>
        {list?.images?.length > 0 && (
          list?.images?.map((i, idx)=> {
            return (
              <Img key={idx} src={`${IMAGE_S3_URL}${i.url}`} onClick={()=> openImgViewer(i.url)}  alt="스토리 이미지" />
            )
          })
        )}
        <TextB1R margin="10px 0">{list?.content}</TextB1R>
        <LikeWrapper onClick={()=>handlerLike()}>
          <SVGIcon name={storyLike ? 'greenGood' : 'grayGood'} />
          <TextB2R>&nbsp;{likeCount}</TextB2R>
        </LikeWrapper>
        <UnderLine />
      </TopWrapper>
    </StoryContainer>
  );
}

const StoryContainer = styled.section`
  padding: 24px;
`;
const TopWrapper = styled.div``;

const Img = styled.img`
  width: 100%;
  height: 175px;
  border-radius: 15px;
  cursor: pointer;
`;

const LikeWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: start;
  cursor: pointer;
`;

const UnderLine = styled.ul`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
`;

export default React.memo(DetailBottomStory);
