import React, { ReactElement, useState } from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH6B, TextB2R, TextH4B, TextH5B, TextH7B, } from '@components/Shared/Text';
import { theme, FlexCol, FlexRow } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';
import { useToast } from '@hooks/useToast';
import { IMAGE_S3_URL } from '@constants/mock';
import { ISpotsDetail } from '@model/index';
import { getSpotLike, postSpotRegistrationsRecruiting } from '@api/spot';
import { cartForm } from '@store/cart';
import {
  destinationForm,
  SET_USER_DELIVERY_TYPE,
  SET_DESTINATION,
  SET_TEMP_DESTINATION,
} from '@store/destination';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { useOnLike } from 'src/query';

// spot list type은 세가지가 있다.
// 1. normal 2. event 3. trial

interface IProps {
  list: ISpotsDetail;
  type: string;
  isSearch?: boolean;
};

const SpotList = ({ list, type, isSearch }: IProps): ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDelivery, orderId } = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { userLocation } = useSelector(destinationForm);
  const { showToast, hideToast } = useToast();
  const [spotRegisteration, setSpotRegisteration] = useState(list?.recruited);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);

  const userLocationLen = !!userLocation.emdNm?.length;
  const pickUpTime = `${list.lunchDeliveryStartTime}-${list.lunchDeliveryEndTime} / ${list.dinnerDeliveryStartTime}-${list.dinnerDeliveryEndTime}`;

  const checkHandler = () => {
    setNoticeChecked(!noticeChecked);
  };

  const goToDetail = (id: number | undefined): void => {
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

    const goToCart = () =>{
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push('/cart');
    };

    const goToDeliveryInfo = () => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: list.id } });
    };

    const goToSelectMenu = () => {
      // 로그인o and 장바구니 x, 메뉴 검색으로 이동
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));  
      router.push('/search');
    };
  
    if (isLoginSuccess) {
      // 로그인o
      if (orderId) {
        // 배송정보 변경에서 넘어온 경우
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
          // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={list?.pickups} spotType={list?.type} onSubmit={goToDeliveryInfo} />,
          }));
        } else {
          // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(SET_BOTTOM_SHEET({
            content: <PickupSheet pickupInfo={list?.pickups} spotType={list?.type} onSubmit={goToCart} />,
          }));
        }
      } else {
        // 로그인o and 장바구니 x, 메뉴 검색으로 이동
        dispatch(SET_BOTTOM_SHEET({
          content: <PickupSheet pickupInfo={list?.pickups} spotType={list?.type} onSubmit={goToSelectMenu} />,
        }));
      }
    } else {
      // 로그인x, 로그인 이동
      dispatch(SET_ALERT({
        alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
        submitBtnText: '확인',
        closeBtnText: '취소',
        onSubmit: () => router.push('/onboarding'),
      }))
    }
  };

  const onClickLike = (e: any) => {
    e.stopPropagation();
    onLike();
  };

  const onLike = useOnLike(list.id!, list.liked);

  const clickSpotOpen = async (id: number | undefined) => {
    if (list.recruited) {
      return;
    }
    const TitleMsg = `프코스팟 오픈에 참여하시겠습니까?\n오픈 시 알려드릴게요!`;
    dispatch(
      SET_ALERT({
        alertMessage: TitleMsg,
        onSubmit: () => {
          setSpotRegisteration(true);
          const message = '참여해주셔서 감사해요:)';
          showToast({ message });
          /* TODO: warning 왜? */
          return () => hideToast();
        },
        submitBtnText: '확인',
        closeBtnText: '취소',
      })
    );

    // try {
    //   const { data } = await postSpotRegistrationsRecruiting(id);
    //   if (data.code === 200) {
    //     setSpotRegisteration(true);
    //     const TitleMsg = `프코스팟 오픈에 참여하시겠습니까?\n오픈 시 알려드릴게요!`;
    //     dispatch(
    //       SET_ALERT({
    //         alertMessage: TitleMsg,
    //         onSubmit: () => {
    //           const message = '참여해주셔서 감사해요:)';
    //           showToast({ message });
    //           /* TODO: warning 왜? */
    //           return () => hideToast();
    //         },
    //         submitBtnText: '확인',
    //         closeBtnText: '취소',
    //       })
    //     );
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
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
                <TextH7B padding="2px 2px 0 2px" color={theme.white}>{`${list?.userCount}명 이용중`}</TextH7B>
              </Tag>
              {list.images.map((i, idx) => {
                return (
                  <div key={idx}>
                    <Img src={`${IMAGE_S3_URL}${i.url}`} alt="매장이미지" />
                  </div>
                );
              })}
            </StorImgWrapper>
            <LocationInfoWrapper type="normal">
              <TextB3R margin="8px 0 0 0" color={theme.black}>
                {list?.name}
              </TextB3R>
              {
                // 유저 위치정보 있을때 노출
                userLocationLen && <TextH6B color={theme.greyScale65}>{`${Math.round(list?.distance)}m`}</TextH6B>
              }
              <LikeWrapper type="normal" onClick={(e) => onClickLike(e)}>
                <SVGIcon name={list.liked ? 'likeRed18' : 'likeBorderGray'} />
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
                <LikeWrapper type="event" onClick={(e) => onClickLike(e)}>
                  <SVGIcon name={list.liked ? 'likeRed18' : 'likeBorderGray'} />
                </LikeWrapper>
              )}
              {list.images.map((i, idx) => {
                return (
                  <div key={idx}>
                    <Img src={`${IMAGE_S3_URL}${i.url}`} alt="매장이미지" />
                  </div>
                );
              })}
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
            <LocationInfoWrapper type="trial">
              <FlexCol>
                <TextH5B margin='0 0 4px 0'>{list.title}</TextH5B>
                <TextB3R margin='0 0 4px 0'>{list.location.address}</TextB3R>
                <TextH6B margin='0 0 8px 0' color={theme.greyScale65}>{`${list.distance}m`}</TextH6B>
                <FlexRow margin='0 0 16px 0'>
                  <SVGIcon name="people" />
                  <TextH6B padding='4px 0 0 2px' color={theme.brandColor}>{`${list.userCount}/100명 참여중`}</TextH6B>
                </FlexRow>
                { 
                  list.submit ? (
                    <Button onClick={()=>clickSpotOpen(list.id)}>참여하기</Button> 
                  )
                  :
                  (
                    <ButtonComplete onClick={() => {}}>참여완료</ButtonComplete> 
                  )
                }
              </FlexCol>
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
        border-radius: 8px;
      `;
    } else if (type === 'normal') {
      return css`
        width: 120px;
      `;
    } else if (type === 'trial') {
      return css`
        min-width: 220px;
        min-height: 200px;
        display: inline-block;
        padding: 24px;
        border: 1px solid ${theme.greyScale6};
        border-radius: 8px;
      `;
    }
  }}
`;

const StorImgWrapper = styled.div`
  position: relative;
  cursor: pointer;
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
  opacity: 90%;
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

const ButtonComplete = styled.button`
  width: 75px;
  height: 38px;
  border: 1px solid ${theme.greyScale25};
  border-radius: 8px;
  background: ${theme.white};
  font-weight: bold;
  color: ${theme.greyScale25};
  cursor: pointer;
`;

export default SpotList;
