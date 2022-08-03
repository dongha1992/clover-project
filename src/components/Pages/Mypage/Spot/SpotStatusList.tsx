import React, {ReactElement, useState, useEffect} from 'react';
import styled from 'styled-components';
import { theme, FlexStart, FlexBetween } from '@styles/theme';
import { TextH5B, TextB3R, TextH6B, TextH4B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { IGetRegistrationStatus, ISpotsInfo } from '@model/index';
import { postSpotsRegistrationsRetrial } from '@api/spot';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { SET_SPOT_INFO } from '@store/spot';
import router from 'next/router';
import { userForm } from '@store/user';
import { commonSelector } from '@store/common';
import { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { ShareSheet } from '@components/BottomSheet/ShareSheet';

interface IProps {
  item: IGetRegistrationStatus;
  getInfo: any;
};

const SpotStatusList = ({ item, getInfo }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const routers = useRouter();
  const { isMobile } = useSelector(commonSelector);
  const { me } = useSelector(userForm);

  const loginUserId = me?.id!;

  const spotType = (type: string | undefined) => {
    switch(type){
      case 'PRIVATE':
        return '프라이빗'
      case 'PUBLIC':
        return '단골가게'
      case 'OWNER':
        return '우리가게'
    };
  };

  const spotStatusStep = (i: IGetRegistrationStatus) => {
    if (i?.rejected) {
      return '오픈 미진행'
    };
    if (i?.type === 'PRIVATE') {
      if(i?.trialUserCount! >= i?.trialTargetUserCount!) {
        return '오픈 검토 중'
      };
      switch(i?.step) {
        case 'CONFIRM':
          return '검토 중'
        case 'TRIAL':
          return '트라이얼 진행 중'
        case 'OPEN':
          return '오픈완료'
      };  
    } else if (i?.type === 'PUBLIC') {
      switch(i?.step) {
        case 'RECRUITING':
          return '모집 중'
        case 'CONFIRM':
          return '오픈 검토 중'
        case 'OPEN':
          return '오픈완료'
      };  
    } else if (i?.type === 'OWNER') {
      switch(i?.step) {
        case 'CONFIRM':
          return '오픈 검토 중'
        case 'OPEN':
          return '오픈완료'
      };  
    }
  };

  // 스팟 등록 - 재신청
  const handleSpotRetrial = async (id: number) => {
    if(getInfo?.canPrivateSpotRegistration) {
      dispatch(
        SET_ALERT({
          alertMessage: `트라이얼(2주) 기간동안 해당 프코스팟으로 5명이 주문/배송을 완료해야 정식 오픈됩니다.\n\n오픈 재신청하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {handleSpotRetrialRes(id)},
        })
      );      
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: `이미 진행 중인 신청이 있어요!\n완료 후 새롭게 신청해 주세요.`,
          submitBtnText: '확인',
        })
      );      
    }
  };

  const handleSpotRetrialRes = async (id: number) => {
    try {
      const { data } = await postSpotsRegistrationsRetrial(id);
      if(data.code === 200){
        location.reload();
      }
    } catch (e) {
      console.error(e);
    };  
  };

  const goToSpotStatusDetail = (id: number, type: string, userId: number) => {
    // 우리가게 신청이고, 신청자일 경우
    if(type === 'OWNER' && (Number(loginUserId) !== userId)) {
      return;
    }
      router.push({
        pathname: `/mypage/spot-status/detail/${id}`,
        query: {
          type: type,
        }
      });
  };

  const goToSpotShare = (id: number) => {
    const currentUrl = window.location.origin;
    const trialSpotId = id;
    const spotLink = `${currentUrl}/spot/open?trialId=${trialSpotId}`;
    if (isMobile) {
      if (navigator.share) {
        navigator
          .share({
            title: '프코스팟 신청 공유 링크',
            url: spotLink,
          })
          .then(() => {
            alert('공유가 완료되었습니다.');
          })
          .catch(console.error);
      } else {
        return 'null';
      };
    } else {
      dispatch(INIT_BOTTOM_SHEET());
      dispatch(
        SET_BOTTOM_SHEET({
          content: <ShareSheet spotLink={spotLink} />,
        })
      );
    };
  };


  return (
    <Container>
      <Wrppaer>
        <FlexBetween margin="0 0 6px 0">
          <Flex>
            <TextH4B color={`${item?.rejected ? theme.greyScale65 : theme.black}`} margin="0 8px 0 0">
              {spotStatusStep(item)}
            </TextH4B>
            <Tag color={theme.brandColor} backgroundColor={theme.brandColor5P}>
              {spotType(item?.type)}
            </Tag>
          </Flex>
          <TextH6B color={theme.greyScale65} textDecoration="underline" pointer onClick={() => goToSpotStatusDetail(item?.id!, item?.type!, item?.userId!)}>
            신청상세 보기
          </TextH6B>
        </FlexBetween>
        <TextH5B>{item?.placeName}</TextH5B>
        <TextB3R>{`${item?.location.address} ${item?.location.addressDetail}`}</TextB3R>
        {
          (item.type === 'PRIVATE' && (item.step === 'TRIAL' || (item?.trialUserCount! >= item?.trialTargetUserCount!))) && !item?.rejected &&
          // 프라이빗인 경우 '트라이얼' or '오픈 검토중' 노출
          <FlexStart margin="4px 0 0 0">
            <SVGIcon name="people" />
            <TextH6B padding='4px 0 0 0' margin="0 0 0 6px" color={theme.brandColor}>{`${item?.trialUserCount}/5명 참여 중`}</TextH6B>
          </FlexStart>
        }
        {
          (item.type === 'PUBLIC' && item.step === 'RECRUITING') &&
          // 단골가게(퍼블릭)인 경우 '모집 중' 노출
          <FlexStart margin="4px 0 0 0">
            <SVGIcon name="people" />
            <TextH6B padding='4px 0 0 0' margin="0 0 0 6px" color={theme.brandColor}>{`${item?.recruitingCount}/100명 참여 중`}</TextH6B>
          </FlexStart>
        }
        {item?.type === 'PRIVATE' && item?.step === 'TRIAL' && !item?.rejected && !item?.canRetrial && (Number(loginUserId) === item.userId) && (
          <Button border color={theme.black} backgroundColor={theme.white} margin="16px 0 0 0" onClick={() => goToSpotShare(item?.id!)}>
            오픈 참여 공유하고 포인트 받기
          </Button>
        )}
        {
          item?.type === 'PRIVATE' && item?.step === 'TRIAL' && item?.canRetrial &&
          <Button border color={theme.black} backgroundColor={theme.white} margin="16px 0 0 0" onClick={() => handleSpotRetrial(item?.id!)}>
            오픈 재신청하기
          </Button>
        }
      </Wrppaer>
    </Container>
  );
};

const Container = styled.div``;

const Wrppaer = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${theme.greyScale6};
  &: last-child {
    border: none;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export default SpotStatusList;
