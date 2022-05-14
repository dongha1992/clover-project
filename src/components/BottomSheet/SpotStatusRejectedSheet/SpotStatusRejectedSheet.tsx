import React from 'react';
import styled from 'styled-components';
import { theme, bottomSheetButton } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { IGetRegistrationStatus } from '@model/index';

type TPrams = {
  onSubmit?: () => void;
  items?: IGetRegistrationStatus;
}

const SpotStatusRejectedSheet = ({ onSubmit, items }: TPrams): JSX.Element => {
  const dispatch = useDispatch();

  const trialRejectedText = '아쉽게도 안내드린 2주 트라이얼 기간 동안 5명 이상 인원모집(배송완료) 조건이 미달되어 오픈 미진행되었음을 안내드립니다.\n\n계속해서 해당 프라이빗 프코스팟의 오픈을 원하신다면 30일 후 재신청이 가능하니 아래 오픈 재신청 버튼을 통해 다시 시도해 주세요. (오픈 재신청은 총 2회 가능하며 단, 이전 트라이얼 모집인원은 리셋돼요!)\n\n자세한 내용은 채팅 문의를 통해 말씀해 주세요.\n감사합니다.';
  const trialRetrialDisabled = '아쉽게도 안내드린 트라이얼 기간동안 5명 이상 인원모집(배송완료) 조건이 미달되어 해당 프코스팟 오픈이 최종 미진행되었음을 안내드립니다.\n\n자세한 내용은 채팅 문의를 통해 말씀해 주세요.\n감사합니다.'
  const noticeContent = () => {
    if (items?.rejected && ((items?.step === 'TRIAL' && items?.rejectionType === 'ETC') || (items?.step !== 'TRIAL'))) {
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

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          오픈 미진행 안내
        </TextH5B>
        <Content>
          <TextB2R padding='16px 0 24px 0'>{noticeContent()}</TextB2R>
          <BtnWrapper>
            {
               items?.rejected && ((items?.step === 'TRIAL' && items?.rejectionType === 'ETC') || (items?.step !== 'TRIAL') || (items?.trialCount === 3)) &&
              // 트라이얼이 아니고 오픈 미진행인 경우 or 트라이얼 재신청 3회째인 경우
              <Button color={theme.black} backgroundColor={theme.white} border onClick={()=>{}}>채팅 문의</Button>
            }
            {
              items?.canRetrial && items?.rejectionType === 'INSUFFICIENCY' && items?.trialCount !== 3 &&
                // 트라이얼 재신청 조건 충족한 경우 true
                <Button color={theme.black} backgroundColor={theme.white} border onClick={()=>{}}>오픈 재신청하기</Button>
            }
            {
              !items?.canRetrial && items?.rejectionType === 'INSUFFICIENCY' && items?.trialCount !== 3 &&
               // 트라이얼 재신청 조건 충족하지 못한 경우 false
                <Button color={theme.black} backgroundColor={theme.white} disabled border onClick={()=>{}}>30일 후 오픈 재신청이 가능합니다.</Button>
            }
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

const Wrapper = styled.div`
`;

const Content = styled.div``;

const BtnWrapper = styled.div``;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(SpotStatusRejectedSheet);
