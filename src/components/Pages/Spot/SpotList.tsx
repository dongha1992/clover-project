import React, { ReactElement, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
  TextH2B,
  TextB3R,
  TextH6B,
  TextB2R,
  TextH4B,
  TextH5B,
  TextH7B,
} from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { useToast } from '@hooks/useToast';
import { IMAGE_S3_URL } from '@constants/mock';
import { INormalSpots } from '@model/index';
import {   
  getSpotLike,
  postSpotLike,
  deleteSpotLike,
  postSpotRegistrations,
 } from '@api/spot';
 import { SET_SPOT_LIKED } from '@store/spot';

// spot list type은 세가지가 있다.
// 1. normal 2. event 3. trial

interface IProps {
  list: INormalSpots;
  type: string;
}

const SpotList = ({ list, type }: IProps): ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast, hideToast } = useToast();
  const [mouseMoved, setMouseMoved] = useState(false);
  const [spotLike, setSpotLike] = useState(list?.liked);
  const [spotRegisteration, setSpotRegisteration] = useState(list.recruited);
  // const [registrations, setRegistrations] = useState<boolean>();
  const goToDetail = (id: number): void => {
    if (!mouseMoved) {
      router.push(`/spot/detail/${id}`);
    }
  };

  const goToCart = (e: any): void => {
    e.stopPropagation();
    router.push('/cart');
  };

  useEffect(()=> {
    const spotLikeData = async() => {
      try{
        const { data } = await getSpotLike(list.id);
        setSpotLike(data.data.liked)
      }catch(err){
        console.error(err);
      };
    };
  
    spotLikeData();
  }, [list, spotLike]);

  const hanlderLike = async (e: any) => {
    e.stopPropagation();
    if(!spotLike){
      try {
        const { data } = await postSpotLike(list.id);
        if(data.code === 200 ){
          // setSpotLike(true);
          dispatch(SET_SPOT_LIKED({isSpotLiked: true}));
        }
      }catch(err){
        console.error(err);
      };
    }else if(spotLike){
      try{
        const { data } = await deleteSpotLike(list.id);
        if(data.code === 200){
          // setSpotLike(false);
          dispatch(SET_SPOT_LIKED({isSpotLiked: false}));
        }
      }catch(err){
        console.error(err);
      };
    };
  };

  const clickSpotOpen = async(id: number) => {
    if(list.recruited){ 
      return;
    };
      try{
        const {data} = await postSpotRegistrations(id);
        if(data.code === 200){
          setSpotRegisteration(true);
          const TitleMsg = `프코스팟 오픈에 참여하시겠습니까?\n오픈 시 알려드릴게요!`;
          dispatch(
            setAlert({
              alertMessage: TitleMsg,
              onSubmit: () => {
                const message = '참여해주셔서 감사해요:)'
                showToast({ message });
                /* TODO: warning 왜? */
                return () => hideToast();
              },
              submitBtnText: '확인',
              closeBtnText: '취소',
            })
          );
          console.log('참여 완료!!! post')
        }
      }catch(err){
        console.error(err);
      };  
  };

  const SpotsListTypeRender = () => {
    switch(type) {
      // 오늘 점심, 신규, 역세권 스팟
      case 'normal':
        return (
          <Container type="normal">
            <StorImgWrapper 
              onMouseMove={() => setMouseMoved(true)}
              onMouseDown={() => setMouseMoved(false)}
              onClick={() => goToDetail(list.id)}>
              <Tag>
                <SVGIcon name="whitePeople" />
                <TextH7B padding='1px 0 0 2px' color={theme.white}>{`${list.userCount}명 이용중`}</TextH7B>
              </Tag>
              <Img src={`${IMAGE_S3_URL}${list.images[0].url}`} alt="매장이미지" />
            </StorImgWrapper>
            <LocationInfoWrapper type="normal">
              <TextB3R margin="8px 0 0 0" color={theme.black}>
                {list.name}
              </TextB3R>
              <TextH6B
                color={theme.greyScale65}
              >{`${Math.round(list.distance)}m`}</TextH6B>
              <LikeWrapper type="normal" onClick={(e)=> hanlderLike(e)}>
                <SVGIcon name={list?.liked ? 'likeRed18' : 'likeBorderGray'} />
                <TextB2R padding='4px 0 0 1px'>{list?.likeCount}</TextB2R>
              </LikeWrapper>
            </LocationInfoWrapper>
          </Container>
        )
      //이벤트 스팟
      case 'event': 
        return (
          <ItemListRowWrapper>
            <ItemListRow>
              <Container type="event">
                <StorImgWrapper onClick={() => goToDetail(list.id)}>
                  <LikeWrapper type="event" onClick={(e)=> hanlderLike(e)}>
                    <SVGIcon name={list?.liked ? 'likeRed18' : 'likeBorderGray'} />
                  </LikeWrapper>
                  <Img src={`${IMAGE_S3_URL}${list.images[0].url}`} alt="매장이미지" />
                </StorImgWrapper>
                <LocationInfoWrapper type="event">
                  <div>
                    <TextH4B>{list.eventTitle}</TextH4B>
                    <TextH6B margin="8px 0 0 0" color={theme.greyScale65}>
                      {list.name}
                    </TextH6B>
                  </div>
                  <ButtonWrapper>
                    <TextH6B
                      color={theme.greyScale65}
                    >{`${Math.round(list.distance)}m`}</TextH6B>
                    <Button onClick={goToCart}>주문하기</Button>
                  </ButtonWrapper>
                </LocationInfoWrapper>
              </Container>
            </ItemListRow>
          </ItemListRowWrapper>
        )
      // 단골 가게 스팟
      case 'trial':
        return(
          <Container type="trial">
            <StorImgWrapper>
              <Tag>
                <SVGIcon name="whitePeople" />
                <TextH7B padding='1px 0 0 2px' color={theme.white}>{`${list.recruitingCount} / 100명 참여중`}</TextH7B>
              </Tag>
              {/* <ImgWrapper src={item.img} alt='매장이미지' /> */}
              <ImgBox src={`${IMAGE_S3_URL}${list?.image?.url}`} alt="매장이미지" />
            </StorImgWrapper>
            <LocationInfoWrapper type="trial">
              <TextWrapper>
                <TextH5B margin="8px 0 0 0" color={theme.black}>
                  {list.placeName}
                </TextH5B>
                <TextH6B
                  color={theme.greyScale65}
                >{`${Math.round(list.distance)}m`}</TextH6B>
              </TextWrapper>
              <Button onClick={() => clickSpotOpen(list.id)}>{spotRegisteration ? '참여완료' : '참여하기'}</Button>
            </LocationInfoWrapper>
          </Container>
        )
      default:
        return null;
    };
  };

  return (
      <>
        {SpotsListTypeRender()}
      </>
    )
  };

const ItemListRowWrapper = styled.div`
  margin-bottom: 48px;
  margin-top: 48px;
`;
export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  > div {
    padding-right: 10px;
    width: 194px;
  }
`;

const Container = styled.section<{ type: string }>`
  margin-right: 16px;
  ${({ type }) => {
    if (type === 'event') {
      return css`
        display: inline-flex;
        position: relative;
        bottom: 0;
        width: 299px;
      `;
    } else if (type === 'normal') {
      return css`
        width: 120px;
      `;
    } else if (type === 'trial') {
      return css`
        display: inline-block;
        width: 298px;
      `;
    }
  }}
`;

const StorImgWrapper = styled.div`
  position: relative;
`;

const ImgBox = styled.img`
  width: 100%;
  height: 174px;
  border-radius: 8px;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 4px;
  padding: 4px 8px;
`;

const Img = styled.img`
  width: 120px;
  heigth: 120px;
  border-radius: 10px;
`;

const LocationInfoWrapper = styled.div<{ type: string }>`
  ${({ type }) => {
    if (type === 'event') {
      return css`
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 16px;
      `;
    } else if (type === 'trial') {
      return `
                display: flex;
                justify-content;
                margin-top: 8px;
                align-items: center;
                justify-content: space-between;
            `;
    } else {
      return `
                margin-top: 8px;
            `;
    }
  }}
`;

const LikeWrapper = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ type }) => {
    if (type === 'event') {
      return css`
        position: absolute;
        right: 8px;
        top: 8px;
      `;
    }
  }}
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 35px;
  margin-right: 7px;
`;

const Button = styled.button`
  width: 75px;
  height: 38px;
  border: 1px solid ${theme.black};
  border-radius: 8px;
  background: ${theme.white};
  font-weight: bold;
  color: ${theme.black};
  cursor: pointer;
`;

const TextWrapper = styled.div``;

export default SpotList;
