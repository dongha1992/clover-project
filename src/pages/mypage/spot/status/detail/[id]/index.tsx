import React, { ReactElement, useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexBetween, fixedBottom } from '@styles/theme';
import { TextH2B, TextB3R, TextH4B, TextH5B, TextB2R, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { LocationInfo, OpenInfo, UserInfo, SpotStatusDetailProgressBar } from '@components/Pages/Mypage/Spot';
import { useQuery } from 'react-query';
import { getSpotsRegistrationStatusDetail } from '@api/spot';
import SlideToggle from '@components/Shared/SlideToggle';
import { IGetRegistrationStatus } from '@model/index';
import router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { userForm } from '@store/user';
import { SET_ALERT } from '@store/alert';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_DESTINATION } from '@store/destination';
import { useToast } from '@hooks/useToast';
import { SET_SPOT_STATUS_DETAIL_ITEMS } from '@store/spot';
import { postDestinationApi } from '@api/destination';
import useIsApp from '@hooks/useIsApp';

const PLAN_GUIDE = [
  {
    title: '프라이빗 프코스팟 오픈 기준에 미달인 경우',
    desc: [
      '건물 내, 배송 출입 제한이 있을때',
      '프코스팟 오픈 불가 지역',
      '코워킹스페이스 입주사 오픈 신청',
      '회사, 학교가 아닌 가정집(개인사유지)인 경우',
      '이미 오픈완료된 회사 및 학교로 스팟 신청을 진행한 경우',
      '트라이얼 진행 중 모집인원에 미충족한 경우',
    ],
  },
  {
    title: '단골가게 프코스팟 오픈 기준에 미달인 경우',
    desc: [
      '단골가게 참여자 모집 중 참여인원 미충족한 경우',
      '요청 스팟의 점주가 스팟 오픈을 희망하지 않고 대체할 수 있는 스팟이 주변에 없을 경우',
    ],
  },
  {
    title: '우리가게 프코스팟 오픈 기준에 미달인 경우',
    desc: ['점주 인터뷰 진행 후, 스팟 오픈 요건에 부합하지 않는 경우'],
  },
];

const SpotStatusDetailPage = (): ReactElement => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { recruited, type } = router.query;
  const { isLoginSuccess, me } = useSelector(userForm);
  const { userTempDestination } = useSelector(destinationForm);
  const currentRef = useRef<HTMLDivElement>(null);
  const [locationInfo, setLocationInfo] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const { showToast, hideToast } = useToast();

  const loginUserId = me?.id;
  const isApp = useIsApp();

  useEffect(() => {
    if (router.isReady) {
      setId(Number(router.query?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if( type === 'OWNER' && me === null) {
      router.replace('/spot'); // 우리가게, 외부 링크로 접속시 스팟 메인으로 리다이렉트
    };
    if (recruited) {
      const message = '참여해 주셔서 감사해요:)';
      showToast({ message });
      return () => hideToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: statusDetail } = useQuery(
    ['statusDetail'],
    async () => {
      const response = await getSpotsRegistrationStatusDetail(id!);
      return response.data.data;
    },
    {
      onSuccess: (response) => {
        dispatch(SET_SPOT_STATUS_DETAIL_ITEMS(response));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const tagType = () => {
    switch (statusDetail?.type) {
      case 'PRIVATE':
        return '프라이빗';
      case 'PUBLIC':
        return '단골가게';
      case 'OWNER':
        return '우리가게';
    }
  };

  const spotStatusStep = (i: IGetRegistrationStatus) => {
    if (i?.rejected) {
      return '오픈 미진행';
    }
    if (i?.type === 'PRIVATE') {
      if (i?.trialUserCount! >= i?.trialTargetUserCount!) {
        return '오픈 검토 중';
      }
      switch (i?.step) {
        case 'CONFIRM':
          return '검토 중';
        case 'TRIAL':
          return '트라이얼 진행 중';
        case 'OPEN':
          return '오픈완료';
      }
    } else if (i?.type === 'PUBLIC') {
      switch (i?.step) {
        case 'RECRUITING':
          return '모집 중';
        case 'CONFIRM':
          return '오픈 검토 중';
        case 'OPEN':
          return '오픈완료';
      }
    } else if (i?.type === 'OWNER') {
      switch (i?.step) {
        case 'CONFIRM':
          return '오픈 검토 중';
        case 'OPEN':
          return '오픈완료';
      }
    }
  };

  const toggleLocationInfo = (): void => {
    setLocationInfo(!locationInfo);
  };

  const toggleUserInfo = (): void => {
    setUserInfo(!userInfo);
  };

  const toggleOpenInfo = (): void => {
    setOpenInfo(!openInfo);
  };

  const privateRegistrationBenefit = (): void => {
    setOpenInfo(true);
    currentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const orderCondition = (): boolean => {
    if (
      statusDetail?.type === 'PRIVATE' &&
      (statusDetail?.step === 'TRIAL' || statusDetail?.step === 'OPEN') &&
      !statusDetail?.rejected
    ) {
      return true;
    } else {
      return false;
    }
  };

  // 스팟 주문하기 - 스팟 관리 현황 상세 : 트라이얼 or 오픈 완료 주문하기
  const orderHandler = async () => {
    // const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

    if (isLoginSuccess) {
      // 로그인 o

      // 주문하기 클릭 후 장바구니로 이동
      const reqBody = {
        name: statusDetail?.placeName!,
        delivery: 'SPOT',
        deliveryMessage: '',
        main: false!,
        receiverName: statusDetail?.userName,
        receiverTel: statusDetail?.userTel,
        location: {
          addressDetail: statusDetail?.location?.addressDetail!,
          address: statusDetail?.location?.address!,
          zipCode: statusDetail?.location?.zipCode!,
          dong: statusDetail?.location?.dong!,
        },
        spotPickupId: statusDetail?.id,
      };
      try {
        const { data } = await postDestinationApi(reqBody); // 배송지 id 값을 위해 api 호출
        if (data.code === 200) {
          const response = data.data;
          const destinationId = response.id;
          dispatch(
            SET_DESTINATION({
              name: response.name,
              location: {
                addressDetail: response.location.addressDetail,
                address: response.location.address,
                dong: response.location.dong,
                zipCode: response.location.zipCode,
              },
              main: response.main,
              deliveryMessage: response.deliveryMessage,
              receiverName: response.receiverName,
              receiverTel: response.receiverTel,
              deliveryMessageType: '',
              delivery: response.delivery,
              id: destinationId,
              spotId: statusDetail?.spotId,
            })
          );
          dispatch(SET_USER_DELIVERY_TYPE('spot'));
          router.push({ pathname: '/cart', query: { isClosed: false } });
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // 로그인x, 로그인 이동
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  const openChat = () => {
    if (isApp) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ cmd: 'webview-permission-microphone-check' }));
    };
    window.ChannelIO('showMessenger');
  };

  return (
    <Container order={orderCondition()!}>
      <TopStatusWrapper>
        <Flex>
          <Tag color={theme.brandColor} backgroundColor={theme.brandColor5P} margin="0 4px 0 0">
            {tagType()}
          </Tag>
          <Tag backgroundColor={theme.greyScale6} color={theme.greyScale65}>{spotStatusStep(statusDetail!)}</Tag>
        </Flex>
        <TextH2B margin="0 0 4px 0">{statusDetail?.placeName}</TextH2B>
        <TextB2R>{`${statusDetail?.location.address} ${statusDetail?.location.addressDetail}`}</TextB2R>
      </TopStatusWrapper>
      <SpotStatusDetailProgressBar item={statusDetail!} />
      {statusDetail?.type === 'PRIVATE' && !statusDetail?.rejected && (
        <BtnWrapper>
          <Button color={theme.black} backgroundColor={theme.white} border onClick={privateRegistrationBenefit}>
            모집 혜택 확인하기
          </Button>
        </BtnWrapper>
      )}
      <ToggleWrapper>
        <FlexBetween padding="24px" onClick={toggleLocationInfo} pointer>
          <TextH4B>장소 정보</TextH4B>
          <SVGIcon name={locationInfo ? 'triangleUp' : 'triangleDown'} />
        </FlexBetween>
        <SlideToggle state={locationInfo} duration={0.5}>
          <LocationInfo item={statusDetail!} />
        </SlideToggle>
      </ToggleWrapper>
      <Row10 />
      {statusDetail?.type !== 'PUBLIC' && me !== null && loginUserId === statusDetail?.userId &&(
        <>
          <ToggleWrapper>
            <FlexBetween padding="24px" onClick={toggleUserInfo} pointer>
              <TextH4B>{statusDetail?.type === 'PRIVATE' ? '신청자 정보' : '장소관리자 정보'}</TextH4B>
              <SVGIcon name={userInfo ? 'triangleUp' : 'triangleDown'} />
            </FlexBetween>
            <SlideToggle state={userInfo} duration={0.5}>
              <UserInfo item={statusDetail!} />
            </SlideToggle>
          </ToggleWrapper>
          <Row10 />
        </>
      )}
      <ToggleWrapper ref={currentRef}>
        <FlexBetween padding="24px" onClick={toggleOpenInfo} pointer>
          <TextH4B>{`${tagType()} 프코스팟 오픈방법 알아보기`}</TextH4B>
          <SVGIcon name={openInfo ? 'triangleUp' : 'triangleDown'} />
        </FlexBetween>
        <SlideToggle state={openInfo} duration={0.5}>
          <OpenInfo type={statusDetail?.type!} />
        </SlideToggle>
      </ToggleWrapper>
      <PlanGuideWrapper>
        <TextH5B color={theme.greyScale65} margin="0 0 16px 0">
          프코스팟 오픈 관련 유의사항
        </TextH5B>
        <Row />
        <TextB3R color={theme.greyScale65} margin="0 0 16px 0">
          프코스팟 오픈 진행 중 아래 사항에 해당하는 경우 오픈이 미진행될 수 있습니다. (이외 자세한 내용은 오픈 미진행
          시, 신청자에게 안내 예정)
        </TextB3R>
        {PLAN_GUIDE.map((item, index) => {
          return (
            <PlanGuidContent key={index}>
              <TextH6B color={theme.greyScale65} margin="0 0 4px 0">
                {item.title}
              </TextH6B>
              {item.desc.map((i, idx) => {
                return (
                  <FlexWrapper key={idx}>
                    <Dot>•</Dot>
                    <TextB3R color={theme.greyScale65} margin="0 0 4px 0">
                      {i}
                    </TextB3R>
                  </FlexWrapper>
                );
              })}
            </PlanGuidContent>
          );
        })}
        <Button onClick={openChat} margin="24px 0 0 0" border color={theme.black} backgroundColor={theme.white}>
          채팅 문의
        </Button>
      </PlanGuideWrapper>
      {orderCondition() && (
        <FixedButton onClick={orderHandler}>
          <Button borderRadius="0" height="100%" padding="10px 0 0 0" backgroundColor={theme.balck}>
            주문하기
          </Button>
        </FixedButton>
      )}
    </Container>
  );
};

const Container = styled.div<{ order: boolean }>`
  ${({ order }) => {
    if (order) {
      return css`
        margin-bottom: 56px;
      `;
    }
  }}
`;

const TopStatusWrapper = styled.section`
  padding: 24px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const BtnWrapper = styled.div`
  padding: 24px;
`;

const ToggleWrapper = styled.section``;

const Row10 = styled.div`
  border-bottom: 10px solid ${theme.greyScale6};
`;

const Row = styled.div`
  border-bottom: 1px solid ${theme.greyScale6};
  margin-bottom: 16px;
`;
const PlanGuidContent = styled.div`
  margin-bottom: 16px;
`;

const PlanGuideWrapper = styled.section`
  background: ${theme.greyScale3};
  padding: 24px;
  margin-top: 48px;
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const Dot = styled.span`
  padding-top: 1px;
  color: ${theme.greyScale65};
`;

const FixedButton = styled.section`
  ${fixedBottom};
  margin-top: 20px;
`;

export default React.memo(SpotStatusDetailPage);
