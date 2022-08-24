import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextB1R, TextH4B, TextB2R } from '@components/Shared/Text';
import { theme, FlexBetween } from '@styles/theme';
import { Tag } from '@components/Shared/Tag';
import { SVGIcon } from '@utils/common';
import { useDispatch } from 'react-redux';
import { postSpotsStoryLike, deleteSpotsStoryLike, getSpotsStoryLike } from '@api/spot';
import { ISpotStories } from '@model/index';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import router from 'next/router';
import { SET_ALERT } from '@store/alert';
import Image from '@components/Shared/Image';
import { showImageViewer } from '@store/imageViewer';

interface IProps {
  list: ISpotStories;
}

const DetailBottomStory = ({ list }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const { isLoginSuccess } = useSelector(userForm);
  const [storyLike, setStoryLike] = useState<boolean>();
  const [likeCount, setLikeCount] = useState(list.likeCount);

  const openImgViewer = (image: string) => {
    dispatch(showImageViewer({ images: [image], startIndex: 0, isShow: true }));
  };

  const getStoryLikeData = async () => {
    try {
      const { data } = await getSpotsStoryLike(list.spotId, list.id);
      setStoryLike(data.data.liked);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getStoryLikeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handlerLike = async () => {
    if (isLoginSuccess) {
      if (!storyLike) {
        try {
          const { data } = await postSpotsStoryLike(list.spotId, list.id);
          if (data.code === 200) {
            setStoryLike(true);
            setLikeCount(likeCount + 1);
          }
        } catch (err) {
          console.error(err);
        }
      } else if (storyLike) {
        try {
          const { data } = await deleteSpotsStoryLike(list.spotId, list.id);
          if (data.code === 200) {
            setStoryLike(false);
            if (likeCount > 0) {
              setLikeCount(likeCount - 1);
            } else {
              return;
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      const TitleMsg = `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`;
      dispatch(
        SET_ALERT({
          alertMessage: TitleMsg,
          onSubmit: () => {
            router.push('/onboarding');
          },
          submitBtnText: '확인',
          closeBtnText: '취소',
        })
      );
    }
  };

  const TagType = () => {
    const type = list?.type;
    switch (type) {
      case 'NOTICE':
        return '공지';
      case 'EVENT':
        return '이벤트';
      case 'GENERAL':
        return '일반';
      default:
        return null;
    }
  };

  return (
    <StoryContainer>
      <TopWrapper>
        <FlexBetween>
          <TextH4B>{list?.title}</TextH4B>
          <Tag color={theme.brandColor} backgroundColor={theme.brandColor5}>
            {TagType()}
          </Tag>
        </FlexBetween>
        <TextB2R margin="0 0 8px 0">{list?.createdAt.split(' ')[0]}</TextB2R>
        {list?.images?.length > 0 &&
          list?.images?.map((i, idx) => {
            return (
              <ImageWrapper key={idx} onClick={() => openImgViewer(i.url)}>
                <Image 
                  src={i?.url} 
                  height='287px'
                  layout="responsive"
                  alt="프코스팟 상세 페이지 스토리 이미지"
                  className='fcospot-img'
                />
              </ImageWrapper>
            );
          })}
        <TextB1R margin="10px 0">{list?.content}</TextB1R>
        <LikeWrapper onClick={() => handlerLike()}>
          <SVGIcon name={storyLike ? 'greenGood' : 'grayGood'} />
          <TextB2R>&nbsp;{likeCount}</TextB2R>
        </LikeWrapper>
        <UnderLine />
      </TopWrapper>
    </StoryContainer>
  );
};

const StoryContainer = styled.section`
  padding: 24px;
`;
const TopWrapper = styled.div``;

const ImageWrapper = styled.div`
  width: 100%;
  height: 175px;
  .fcospot-img{
    border-radius: 15px;
    cursor: pointer;
  }
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
