import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import {
  TextH2B,
  TextB3R,
  TextH6B,
  TextB2R,
  TextH4B,
  TextH5B,
} from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@store/alert';
import { useToast } from '@hooks/useToast';
import { IMAGE_S3_URL } from '@constants/mock';
import { ISpots } from '@model/index';
import { INewSpots } from '@pages/spot';

// spot list type은 세가지가 있다.
// 1. normal 2. event 3. trial

interface IProps {
  items: INewSpots[];
  title?: string;
  subTitle?: string;
  type: string;
  btnText ?:string;
}

const SpotList = ({ items, title, subTitle, type, btnText }: IProps): ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast, hideToast } = useToast();

  const goToDetail = (id: number): void => {
    router.push(`/spot/detail/${id}`);
  };

  const goToCart = (e: any): void => {
    e.stopPropagation();
    router.push('/cart');
  };

  const clickSpotOpen = (e: any): void => {
    e.stopPropagation();
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
  };

  const SpotsListTypeRender = () => {
    switch(type) {
      case 'normal':
        return (
          <ItemListRowWrapper>
            <TextH2B padding="0 0 24px 0">{title}</TextH2B>
            <ItemListRow>
              {items?.map((item: any, index: number) => {
                return (
                  <Container
                    type="normal"
                    onClick={() => goToDetail(item.id)}
                    key={index}
                  >
                    <StorImgWrapper>
                      <Tag>
                        <SVGIcon name="fcoSpot" />
                        {`${item.userCount}명 이용중`}
                      </Tag>
                      <Img key={index} src={`${IMAGE_S3_URL}${item.images[0].url}`} alt="매장이미지" />
                    </StorImgWrapper>
                    <LocationInfoWrapper type="normal">
                      <TextB3R margin="8px 0 0 0" color={theme.black}>
                        {item.name}
                      </TextB3R>
                      <TextH6B
                        color={theme.greyScale65}
                      >{`${Math.round(item.distance)}m`}</TextH6B>
                      <LikeWrapper type="normal">
                        <SVGIcon name={item.liked ? 'likeRed18' : 'likeBorderGray'} />
                        <TextB2R padding='4px 0 0 1px'>{item.likeCount}</TextB2R>
                      </LikeWrapper>
                    </LocationInfoWrapper>
                  </Container>
                );
              })}
            </ItemListRow>
          </ItemListRowWrapper>
        )
      case 'event': 
        return (
          <ItemListRowWrapper>
            <TextH2B padding="0 0 24px 0">{title}</TextH2B>
            <ItemListRow>
              {items?.map((item: any, index: number) => {
                return (
                  <Container
                    type="event"
                    onClick={() => goToDetail(item.id)}
                    key={index}
                  >
                    <StorImgWrapper>
                      <LikeWrapper type="event">
                        <SVGIcon name="likeBlack" />
                      </LikeWrapper>
                      <Img key={index} src={`${IMAGE_S3_URL}${item.images[0].url}`} alt="매장이미지" />
                    </StorImgWrapper>
                    <LocationInfoWrapper type="event">
                      <div>
                        <TextH4B>{item.eventTitle}</TextH4B>
                        <TextH6B margin="8px 0 0 0" color={theme.greyScale65}>
                          {item.name}
                        </TextH6B>
                      </div>
                      <ButtonWrapper>
                        <TextH6B
                          color={theme.greyScale65}
                        >{`${Math.round(item.distance)}m`}</TextH6B>
                        <Button onClick={goToCart}>{btnText}</Button>
                      </ButtonWrapper>
                    </LocationInfoWrapper>
                  </Container>
                );
              })}
            </ItemListRow>
          </ItemListRowWrapper>
        )
      case 'trial':
        return(
          <ItemListRowWrapper>
            <TextH2B>{title}</TextH2B>
            <TextB2R color={theme.greyScale65} padding="8px 0 23px 0">
              {subTitle}
            </TextB2R>
            <ItemListRow>
              {items?.map((item: any, index: number) => {
                return (
                  <Container
                    type="trial"
                    onClick={() => goToDetail(item.id)}
                    key={index}
                  >
                    <StorImgWrapper>
                      <Tag>
                        <SVGIcon name="fcoSpot" />
                        {`${item.users}/100명 참여중`}
                      </Tag>
                      {/* <ImgWrapper src={item.img} alt='매장이미지' /> */}
                      <ImgBox />
                    </StorImgWrapper>
                    <LocationInfoWrapper type="trial">
                      <TextWrapper>
                        <TextH5B margin="8px 0 0 0" color={theme.black}>
                          {item.location}
                        </TextH5B>
                        <TextH6B
                          color={theme.greyScale65}
                        >{`${item.distance}m`}</TextH6B>
                      </TextWrapper>
                      <Button onClick={clickSpotOpen}>{btnText}</Button>
                    </LocationInfoWrapper>
                  </Container>
                );
              })}
            </ItemListRow>
          </ItemListRowWrapper>
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

const ItemListRowWrapper = styled.section`
  width: auto;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 48px;
  margin-top: 48px;
`;
export const ItemListRow = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  cursor: pointer;
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
        display: inline-block;
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

const ImgBox = styled.div`
  width: 298px;
  height: 174px;
  background: ${theme.greyScale25};
  border-radius: 8px;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.4px;
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
`;

const TextWrapper = styled.div``;

export default SpotList;
