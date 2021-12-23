import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import {
  TextH2B,
  TextH7B,
  TextB3R,
  TextH6B,
  TextB2R,
  TextH4B,
  TextH5B,
} from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';

interface IProps {
  items: any; // API 통신 이후 타입 지정 예정
  title?: string;
  subTitle?: string;
  type: string;
  btnText ?:string;
}

const SpotList = ({ items, title, subTitle, type, btnText }: IProps): ReactElement => {
  const router = useRouter();

  const goToDetail = (id: number): void => {
    router.push(`/spot/detail/${id}`);
  };

  const goToCart = (e: any): void => {
    e.stopPropagation();
    router.push('/cart');
  };

  return (
    <>
      {type === 'normal' && (
        <ItemListRowWrapper>
          <TextH2B padding="0 0 24px 0">{title}</TextH2B>
          <ItemListRow>
            {items.map((item: any, index: number) => {
              return (
                <Container
                  type="normal"
                  onClick={() => goToDetail(item.id)}
                  key={index}
                >
                  <StorImgWrapper>
                    <Text>
                      <SVGIcon name="fcoSpot" />
                      {`${item.users}명 이용중`}
                    </Text>
                    <ImgWrapper src={item.img} alt="매장이미지" />
                  </StorImgWrapper>
                  <LocationInfoWrapper type="normal">
                    <TextB3R margin="8px 0 0 0" color={theme.black}>
                      {item.location}
                    </TextB3R>
                    <TextH6B
                      color={theme.greyScale65}
                    >{`${item.distance}m`}</TextH6B>
                    <LikeWrapper type="normal">
                      <SVGIcon name="likeRed" />
                      {item.like}
                    </LikeWrapper>
                  </LocationInfoWrapper>
                </Container>
              );
            })}
          </ItemListRow>
        </ItemListRowWrapper>
      )}
      {type === 'event' && (
        <ItemListRowWrapper>
          <TextH2B padding="0 0 24px 0">{title}</TextH2B>
          <ItemListRow>
            {items.map((item: any, index: number) => {
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
                    <ImgWrapper src={item.img} alt="매장이미지" />
                  </StorImgWrapper>
                  <LocationInfoWrapper type="event">
                    <TextH4B>{item.desc}</TextH4B>
                    <TextH6B margin="8px 0 0 0" color={theme.greyScale65}>
                      {item.location}
                    </TextH6B>
                    <ButtonWrapper>
                      <TextH6B
                        color={theme.greyScale65}
                      >{`${item.distance}m`}</TextH6B>
                      <Button onClick={goToCart}>{btnText}</Button>
                    </ButtonWrapper>
                  </LocationInfoWrapper>
                </Container>
              );
            })}
          </ItemListRow>
        </ItemListRowWrapper>
      )}
      {type === 'trial' && (
        <ItemListRowWrapper>
          <TextH2B>{title}</TextH2B>
          <TextB2R color={theme.greyScale65} padding="8px 0 23px 0">
            {subTitle}
          </TextB2R>
          <ItemListRow>
            {items.map((item: any, index: number) => {
              return (
                <Container
                  type="trial"
                  onClick={() => goToDetail(item.id)}
                  key={index}
                >
                  <StorImgWrapper>
                    <Text>
                      <SVGIcon name="fcoSpot" />
                      {`${item.users}명 이용중`}
                    </Text>
                    <LikeWrapper type="trial">
                      <SVGIcon name="likeRed" />
                    </LikeWrapper>
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
                    <Button onClick={goToCart}>{btnText}</Button>
                  </LocationInfoWrapper>
                </Container>
              );
            })}
          </ItemListRow>
        </ItemListRowWrapper>
      )}
    </>
  );
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
      return `
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

const Text = styled.span`
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

const ImgWrapper = styled.img`
  width: 120px;
  heigth: 120px;
  border-radius: 10px;
`;

const LocationInfoWrapper = styled.div<{ type: string }>`
  ${({ type }) => {
    if (type === 'event') {
      return css`
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
  margin-top: 8px;
  ${({ type }) => {
    if (type === 'event' || type === 'trial') {
      return css`
        position: absolute;
        right: 8px;
      `;
    }
  }}
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 10px;
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
