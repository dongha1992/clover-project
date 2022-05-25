import React, {ReactElement, useState, useEffect} from 'react';
import styled from 'styled-components';
import { theme, FlexStart, FlexBetween } from '@styles/theme';
import { TextH5B, TextB3R, TextH6B, TextH4B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { IGetRegistrationStatus, ISpotsInfo } from '@model/index';
import { postSpotsRegistrationsRetrial, getSpotInfo } from '@api/spot';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { SET_SPOT_INFO } from '@store/spot';

interface IProps {
  items: IGetRegistrationStatus[];
};

const SpotStatusList = ({ items }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [info, setInfo] = useState<ISpotsInfo>();

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
    if(info?.canPrivateSpotRegistration) {
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

  const goToSpotStatusDetail = (id: number) => {
    router.push(`/mypage/spot-status/detail/${id}`);
  };

  useEffect(() => {
    // 스팟 정보 조회
    const getSpotInfoData = async () => {
      try {
        const { data } = await getSpotInfo();
        if (data.code === 200) {
          setInfo(data.data);
          dispatch(SET_SPOT_INFO(data.data));  
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSpotInfoData();
  }, []);

  return (
    <Container>
      {items?.map((i, idx) => {
        return (
          <Wrppaer key={idx}>
            <FlexBetween margin="0 0 6px 0">
              <Flex>
                <TextH4B color={`${i?.rejected ? theme.greyScale65 : theme.black}`} margin="0 8px 0 0">
                  {spotStatusStep(i)}
                </TextH4B>
                <Tag color={theme.brandColor} backgroundColor={theme.brandColor5P}>
                  {spotType(i?.type)}
                </Tag>
              </Flex>
              <TextH6B color={theme.greyScale65} textDecoration="underline" pointer onClick={() => goToSpotStatusDetail(i?.id!)}>
                신청상세 보기
              </TextH6B>
            </FlexBetween>
            <TextH5B>{i?.placeName}</TextH5B>
            <TextB3R>{`${i?.location.address} ${i?.location.addressDetail}`}</TextB3R>
            {
              (i.type === 'PRIVATE' && (i.step === 'TRIAL' || (i?.trialUserCount! >= i?.trialTargetUserCount!))) && !i?.rejected &&
              // 프라이빗인 경우 '트라이얼' or '오픈 검토중' 노출
              <FlexStart margin="4px 0 0 0">
                <SVGIcon name="people" />
                <TextH6B padding='4px 0 0 0' margin="0 0 0 6px" color={theme.brandColor}>{`${i?.trialUserCount}/5명 참여 중`}</TextH6B>
              </FlexStart>
            }
            {
              (i.type === 'PUBLIC' && i.step === 'RECRUITING') &&
              // 단골가게(퍼블릭)인 경우 '모집 중' 노출
              <FlexStart margin="4px 0 0 0">
                <SVGIcon name="people" />
                <TextH6B padding='4px 0 0 0' margin="0 0 0 6px" color={theme.brandColor}>{`${i?.recruitingCount}/100명 참여 중`}</TextH6B>
              </FlexStart>
            }
            {i?.type === 'PRIVATE' && i?.step === 'TRIAL' && !i?.rejected && !i?.canRetrial && (
              <Button border color={theme.black} backgroundColor={theme.white} margin="16px 0 0 0">
                오픈 참여 공유하고 포인트 받기
              </Button>
            )}
            {
              i?.type === 'PRIVATE' && i?.step === 'TRIAL' && i?.canRetrial &&
              <Button border color={theme.black} backgroundColor={theme.white} margin="16px 0 0 0" onClick={() => handleSpotRetrial(i?.id!)}>
                오픈 재신청하기
              </Button>
            }
          </Wrppaer>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 70px;
`;

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
