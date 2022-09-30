import React from 'react';
import styled from 'styled-components';
import { theme, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { IGetRegistrationStatus } from '@model/index';
import { postSpotsRegistrationsRetrial } from '@api/spot';
import { spotSelector } from '@store/spot';
import { useSelector } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { useRouter } from 'next/router';
import useIsApp from '@hooks/useIsApp';

type TPrams = {
  onSubmit?: () => void;
  items?: IGetRegistrationStatus;
};

const SpotStatusRejectedSheet = ({ onSubmit, items }: TPrams): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { spotsRegistrationInfo } = useSelector(spotSelector);
  const isApp = useIsApp();

  const trialRejectedText =
    '아쉽게도 안내드린 2주 트라이얼 기간 동안 5명 이상 인원모집(배송완료) 조건이 미달되어 오픈 미진행되었음을 안내드립니다.\n\n계속해서 해당 프라이빗 프코스팟의 오픈을 원하신다면 30일 후 재신청이 가능하니 아래 오픈 재신청 버튼을 통해 다시 시도해 주세요. (오픈 재신청은 총 2회 가능하며 단, 이전 트라이얼 모집인원은 리셋돼요!)\n\n자세한 내용은 채팅 문의를 통해 말씀해 주세요.\n감사합니다.';
  const trialRetrialDisabled =
    '아쉽게도 안내드린 트라이얼 기간동안 5명 이상 인원모집(배송완료) 조건이 미달되어 해당 프코스팟 오픈이 최종 미진행되었음을 안내드립니다.\n\n자세한 내용은 채팅 문의를 통해 말씀해 주세요.\n감사합니다.';

  const noticeContent = () => {
    if (items?.rejected && ((items?.step === 'TRIAL' && items?.rejectionType === 'ETC') || items?.step !== 'TRIAL')) {
      return items?.rejectionMessage;
    } else if (items?.rejected && items?.trialCount! < 3) {
      return trialRejectedText;
    } else if (items?.rejected && items?.trialCount === 3) {
      return trialRetrialDisabled;
    }
  };

  const submitHandler = (): void => {
    onSubmit && onSubmit();
    dispatch(INIT_BOTTOM_SHEET());
  };

  // 스팟 재신청
  const handleSpotRetrial = async (id: number) => {
    if (spotsRegistrationInfo?.canPrivateSpotRegistration) {
      dispatch(
        SET_ALERT({
          alertMessage: `트라이얼(2주) 기간동안 해당 프코스팟으로 5명이 주문/배송을 완료해야 정식 오픈됩니다.\n\n오픈 재신청하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => {
            handleSpotRetrialRes(id);
          },
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
      if (data.code === 200) {
        router.push('/mypage/spot/status');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openChat = () => {
    if (isApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ cmd: 'webview-permission-microphone-check' }));
    }
    window.ChannelIO('showMessenger');
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          오픈 미진행 안내
        </TextH5B>
        <Content>
          <TextB2R padding="16px 0 24px 0">{noticeContent()}</TextB2R>
          <BtnWrapper>
            {items?.rejected &&
              ((items?.step === 'TRIAL' && items?.rejectionType === 'ETC') ||
                items?.step !== 'TRIAL' ||
                items?.trialCount === 3) && (
                // 트라이얼이 아니고 오픈 미진행인 경우 or 트라이얼 재신청 3회째인 경우
                <Button color={theme.black} backgroundColor={theme.white} border onClick={openChat}>
                  채팅 문의
                </Button>
              )}
            {items?.canRetrial && items?.rejectionType === 'INSUFFICIENCY' && items?.trialCount !== 3 && (
              // 트라이얼 재신청 조건 충족한 경우 true
              <Button
                color={theme.black}
                backgroundColor={theme.white}
                border
                onClick={() => handleSpotRetrial(items?.id!)}
              >
                오픈 재신청하기
              </Button>
            )}
            {!items?.canRetrial && items?.rejectionType === 'INSUFFICIENCY' && items?.trialCount !== 3 && (
              // 트라이얼 재신청 조건 충족하지 못한 경우 false
              <Button color={theme.black} backgroundColor={theme.white} disabled border>
                30일 후 오픈 재신청이 가능합니다.
              </Button>
            )}
          </BtnWrapper>
        </Content>
      </Wrapper>
      <ButtonContainer onClick={submitHandler}>
        <Button height="100%" width="100%" borderRadius="0">
          확인
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

const Wrapper = styled.div``;

const Content = styled.div``;

const BtnWrapper = styled.div``;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(SpotStatusRejectedSheet);
