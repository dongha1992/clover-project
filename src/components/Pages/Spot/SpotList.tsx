import React, { ReactElement, useState } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextB2R, TextH4B, TextH5B, TextH7B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';
import { useToast } from '@hooks/useToast';
import { IMAGE_S3_URL } from '@constants/mock';
import { ISpotsDetail } from '@model/index';
import { getSpotLike, postSpotRegistrationsRecruiting } from '@api/spot';
import { useQuery } from 'react-query';
import { useDeleteLike, useOnLike } from 'src/query';
import { cartForm } from '@store/cart';
import {
  destinationForm,
  SET_USER_DESTINATION_STATUS,
  SET_DESTINATION,
  SET_TEMP_DESTINATION,
} from '@store/destination';

// spot list type은 세가지가 있다.
// 1. normal 2. event 3. trial

interface IProps {
  list: ISpotsDetail;
  type: string;
  isSearch?: boolean;
}

const SpotList = ({ list, type, isSearch }: IProps): ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDelivery, orderId } = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { userLocation } = useSelector(destinationForm);

  const { showToast, hideToast } = useToast();
  const [spotRegisteration, setSpotRegisteration] = useState(list?.recruited);

  const userLocationLen = !!userLocation.emdNm?.length;

  const pickUpTime = `${list.lunchDeliveryStartTime}-${list.lunchDeliveryEndTime} / ${list.dinnerDeliveryStartTime}-${list.dinnerDeliveryEndTime}`;

  const goToDetail = (id: number): void => {
    if (isSearch) {
      return;
    }
    router.push(`/spot/detail/${id}`);
  };

  const orderHandler = (e: any): void => {
    e.stopPropagation();
    const destinationInfo = {
      name: list.name,
      location: {
        addressDetail: list.location.addressDetail,
        address: list.location.address,
        dong: list.name,
        zipCode: list.location.zipCode,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: list.type,
      spotPickupId: list.pickups[0].id,
    };

    if (isLoginSuccess) {
      // 배송정보 변경에서 넘어온 경우
      if (orderId) {
        dispatch(SET_TEMP_DESTINATION(destinationInfo));
        router.push({
          pathname: '/mypage/order-detail/edit/[orderId]',
          query: { orderId },
        });
        return;
      }

      if (cartLists.length) {
        // 로그인o and 장바구니 o
        if (isDelivery) {
          // 장바구니 o , 배송 정보에서 넘어온 경우
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push({ pathname: '/cart/delivery-info', query: { destinationId: list.id } });
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_USER_DESTINATION_STATUS('spot'));
          dispatch(SET_DESTINATION(destinationInfo));
          dispatch(SET_TEMP_DESTINATION(destinationInfo));
          router.push('/cart');
        }
      } else {
        // 로그인o and 장바구니 x
        router.push('/search');
      }
    } else {
      // 로그인x
      router.push('/onboarding');
    }
  };

  const { data: spotLiked, refetch } = useQuery(['spotLike', list?.id], async () => {
    if (isSearch) {
      return;
    }
    if (list?.id) {
      const response = await getSpotLike(list?.id);
      return response.data.data.liked;
    }
  });

  // react-query
  const onLike = useOnLike();
  const deleteLike = useDeleteLike();

  const hanlderLike = async (e: any) => {
    e.stopPropagation();
    if (isLoginSuccess) {
      if (spotLiked) {
        deleteLike(list.id);
      } else {
        onLike(list.id);
      }
    } else {
      router.push('/onboarding');
    }
  };

  const clickSpotOpen = async (id: number) => {
    if (list.recruited) {
      return;
    }
    try {
      const { data } = await postSpotRegistrationsRecruiting(id);
      if (data.code === 200) {
        setSpotRegisteration(true);
        const TitleMsg = `프코스팟 오픈에 참여하시겠습니까?\n오픈 시 알려드릴게요!`;
        dispatch(
          SET_ALERT({
            alertMessage: TitleMsg,
            onSubmit: () => {
              const message = '참여해주셔서 감사해요:)';
              showToast({ message });
              /* TODO: warning 왜? */
              return () => hideToast();
            },
            submitBtnText: '확인',
            closeBtnText: '취소',
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const SpotsListTypeRender = () => {
    switch (type) {
      // 오늘 점심, 신규, 역세권 스팟
      case 'normal':
        return (
          <Container type="normal">
            <StorImgWrapper onClick={() => goToDetail(list.id)}>
              <Tag>
                <SVGIcon name="whitePeople" />
                {
                  list.userCount ? (
                    <TextH7B padding="1px 0 0 2px" color={theme.white}>{`${list?.userCount}명 이용중`}</TextH7B>
                  )
                  :
                  (
                    <TextH7B padding="1px 0 0 2px" color={theme.white}>0명 이용중</TextH7B>
                  )
                }
              </Tag>
              {
                list.images.map((i, idx) => {
                  return (
                    <div key={idx}>
                      <Img src={`${IMAGE_S3_URL}${i.url}`} alt="매장이미지" />
                    </div>
                  )
                })
              }
            </StorImgWrapper>
            <LocationInfoWrapper type="normal">
              <TextB3R margin="8px 0 0 0" color={theme.black}>
                {list?.name}
              </TextB3R>
              {
                // 유저 위치정보 있을때 노출
                userLocationLen && <TextH6B color={theme.greyScale65}>{`${Math.round(list?.distance)}m`}</TextH6B>
              }
              <LikeWrapper type="normal" onClick={(e) => hanlderLike(e)}>
                <SVGIcon name={spotLiked ? 'likeRed18' : 'likeBorderGray'} />
                <TextB2R padding="4px 0 0 1px">{list?.likeCount}</TextB2R>
              </LikeWrapper>
            </LocationInfoWrapper>
          </Container>
        );
      //이벤트 스팟
      case 'event':
        return (
          <Container type="event">
            <StorImgWrapper onClick={() => goToDetail(list.id)}>
              {!isSearch && (
                <LikeWrapper type="event" onClick={(e) => hanlderLike(e)}>
                  <SVGIcon name={spotLiked ? 'likeRed18' : 'likeBorderGray'} />
                </LikeWrapper>
              )}
              {
                list.images.map((i, idx) => {
                  return (
                    <div key={idx}>
                      <Img src={`${IMAGE_S3_URL}${i.url}`} alt="매장이미지" />
                    </div>
                  )
                })
              }
            </StorImgWrapper>
            <LocationInfoWrapper type="event">
              <div>
                <TextH4B>{list?.eventTitle}</TextH4B>
                <TextH6B margin="8px 0 0 0" color={theme.greyScale65}>
                  {list?.name}
                </TextH6B>
              </div>
              <ButtonWrapper>
                {
                  // 유저 위치정보 있을때 노출
                  userLocationLen && <TextH6B color={theme.greyScale65}>{`${Math.round(list?.distance)}m`}</TextH6B>
                }
                <Button onClick={orderHandler}>주문하기</Button>
              </ButtonWrapper>
            </LocationInfoWrapper>
          </Container>
        );
      // 단골 가게 스팟
      case 'trial':
        return (
          <Container type="trial">
            <StorImgWrapper>
              <Tag>
                <SVGIcon name="whitePeople" />
                <TextH7B padding="1px 0 0 2px" color={theme.white}>{`${list?.recruitingCount} / 100명 참여중`}</TextH7B>
              </Tag>
              {/* <ImgWrapper src={item.img} alt='매장이미지' /> */}
              <ImgBox src={`${IMAGE_S3_URL}${list?.image?.url}`} alt="매장이미지" />
            </StorImgWrapper>
            <LocationInfoWrapper type="trial">
              <TextWrapper>
                <TextH5B margin="8px 0 0 0" color={theme.black}>
                  {list?.placeName}
                </TextH5B>
                {
                  // 유저 위치정보 있을때 노출
                  userLocationLen && <TextH6B color={theme.greyScale65}>{`${Math.round(list?.distance)}m`}</TextH6B>
                }
              </TextWrapper>
              <Button onClick={() => clickSpotOpen(list?.id)}>{spotRegisteration ? '참여완료' : '참여하기'}</Button>
            </LocationInfoWrapper>
          </Container>
        );
      default:
        return null;
    }
  };
  return <>{SpotsListTypeRender()}</>;
};

const Container = styled.section<{ type: string }>`
  margin-right: 16px;
  ${({ type }) => {
    if (type === 'event') {
      return css`
        display: inline-flex;
        position: relative;
        bottom: 0;
        width: 299px;
        margin-bottom: 48px;
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
  cursor: pointer;
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
