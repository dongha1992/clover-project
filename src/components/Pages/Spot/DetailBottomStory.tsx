import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import Tag from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch } from 'react-redux';
import {SET_IMAGE_VIEWER} from '@store/common';
import { IMAGE_S3_URL } from '@constants/mock/index';
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
    images: [{
      url: string;
      width: string;
      height: string;
      size: string;
    }];
};

const DetailBottomStory = ({id}: IProps ): ReactElement => {
  const dispatch = useDispatch();
  const [stories, setStories] = useState<ISpotStories[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const openImgViewer =  (images: any) => {
    dispatch(SET_IMAGE_VIEWER(images));
  };

  useEffect(()=> {
    const getData = async() => {
      try{
          const {data} = await getSpotsDetailStory(id, page);
          const list = data?.data.spotStories;
          const lastPage = data.data.pagination;
          setStories((prevList)=>[...prevList, ...list]);
          setIsLastPage(page === lastPage.totalPage);
      }catch(err){
        if(err)
        console.error(err);
      };
    }
    getData();
  }, [page]);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
      // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
      setPage(page + 1);
    }
   };
  
  useEffect(() => {
    // scroll event listener 등록
    window.addEventListener("scroll", handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  },[stories.length > 0]);
    
  return (
    <>
      {stories.length > 0 ? (
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
                {item?.images?.length > 0 && (
                  item.images?.map((i, idx)=> {
                    return (
                      <Img key={idx} src={`${IMAGE_S3_URL}${i.url}`} onClick={()=> openImgViewer(i.url)}  alt="스토리 이미지" />
                    )
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
`;

const UnderLine = styled.ul`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
`;

export default DetailBottomStory;
