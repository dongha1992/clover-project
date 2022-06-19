import React from 'react';
import styled, { css } from 'styled-components';
import { TextB3R, TextH4B, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { theme, FlexBetween, textH6 } from '@styles/theme';
import { EventTooltip } from '@components/Shared/Tooltip';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import { SpotStatusRejectedSheet } from '@components/BottomSheet/SpotStatusRejectedSheet';
import { IGetRegistrationStatus } from '@model/index';

interface IParams {
  item: IGetRegistrationStatus;
};

const SpotStatusDetailProgressBar = ({ item }: IParams) => {
  const dispatch = useDispatch();

  const trialStartDate = new Date(item?.trialStartedAt!);
  const trialEndDate = new Date(item?.trialEndedAt!);

  const formtrialStart = `${trialStartDate.getMonth()+1}월 ${trialStartDate.getDate()}일`;
  const formtrialEnd = `${trialEndDate.getMonth()+1}월 ${trialEndDate.getDate()}일`

  const spotOpenRejectedText = () => {
    if(item?.rejected){
      if((item?.step === 'TRIAL' && item?.rejectionType === 'ETC') || (item?.step !== 'TRIAL') || (item?.trialCount === 3)) {
        return {
          title: '아쉽게도 해당 프코스팟은\n오픈이 미진행되었습니다', 
        }
      } else {
        return {
          title: '트라이얼 종료!\n30일 후 재신청할 수 있어요', 
        }
      }
    }
  };

  const progressStepType = () => {
    switch(item?.type) {
      case 'PRIVATE': {
        // 프라이빗
        if(item?.step === 'CONFIRM') {
          // 검토중
          return {
            title: 'STEP 1.\n프코매니저가 스팟을 검토 중이에요.', 
            subtitle: '제출한 신청서를 프코 매니저가 검토 중이에요\n조금만 기다려주세요!',
            icon: '/ic_confirm.png',
          }
        } else if(item?.step === 'TRIAL') {
          // 트라이얼
          return {
            title: 'STEP 2.\n트라이얼 기간 동안 5명을 모집해 주세요!', 
            subtitle: '까지 5명 이상이 해당 스팟으로\n주문을 완료해야 정식 오픈 돼요!',
            icon: '/ic_trial.png'
          }
        } else if(item?.trialUserCount! >= item?.trialTargetUserCount!) {
          // 오픈 검토중
          return {
            title: 'STEP 3.\n오픈 전 마지막 검토 중이에요', 
            subtitle: '성공적인 프코스팟 오픈을 위해 마지막 검토를 진행 중이에요!\n오픈 여부는 2~3일 정도 소요될 예정이니 조금만 기다려주세요.',
            icon: '/ic_open_confirm.png'
          }
        } else if(item?.step === 'OPEN') {
          // 오픈
          return {
            title: 'STEP 4.\n프코스팟이 정식 오픈됐어요!', 
            subtitle: '트라이얼 진행 후 프코스팟을 정식 오픈했습니다\n많은 이용 부탁드려요~',
            icon: '/ic_open.png'
          }
        } 
      }
      case 'PUBLIC': {
        // 퍼블릭(단골가게)
        if (item?.step === 'RECRUITING') {
          // 모집중
          return {
            title: 'STEP 1.\n신청한 스팟으로 100명을 모집해 주세요!', 
            subtitle: '단골가게를 오픈하려면 100명의 오픈 참여가 필요해요!\n주변 프코회원들에게 스팟을 공유해보세요',
            icon: '/ic_trial.png'
          }
        } else if(item?.step === 'CONFIRM') {
          // 오픈 검토 중
          return {
            title: 'STEP 2.\n프코매니저가 스팟을 검토 중이에요.', 
            subtitle: '스팟 오픈 관련 인터뷰 진행을 위해 프코매니저가 \n신청 가게로 방문 예정이에요.',
            icon: '/ic_open_confirm.png'
          }
        } else if(item?.step === 'OPEN') {
          // 오픈
          return {
            title: 'STEP 3.\n프코스팟이 정식 오픈됐어요!', 
            subtitle: '프코스팟을 오픈했습니다\n많은 이용 부탁드려요~',
            icon: '/ic_open.png'
          }
        } 
      }
      case 'OWNER': {
        // 우리가게
        if (item?.step === 'CONFIRM') {
          // 오픈 검토중
          return {
            title: 'STEP 1.\n프코매니저가 스팟을 검토 중이에요.', 
            subtitle: '스팟 오픈 관련 인터뷰 진행을 위해 프코매니저가\n신청 가게로 방문 예정이에요.',
            icon: '/ic_open_confirm.png'
          }
        } else if(item?.step === 'OPEN') {
          // 오픈
          return {
            title: 'STEP 2.\n프코스팟이 오픈됐어요!', 
            subtitle: '프코스팟을 오픈했습니다\n많은 이용 부탁드려요~',
            icon: '/ic_open.png',
          }
        } 
      }
    }
  };

  const typeBottomTemp = () => {
    switch(item?.type){
      case 'PRIVATE':
        return {
          bottomText: [
            { id: 0, step: 'CONFIRM', text: '검토 중'},
            { id: 1, step: 'TRIAL', text: '트라이얼' },
            { id: 2, step: 'OPEN_CONFIRM', text: '오픈 검토 중' },
            { id: 3, step: 'OPEN', text: '오픈완료' },
          ],
        } 
      case 'PUBLIC':
        return {
          bottomText: [
            { id: 0, step: 'RECRUITING', text: '모집 중' },
            { id: 1, step: 'CONFIRM', text: '오픈 검토 중' },
            { id: 2, step: 'OPEN', text: '오픈완료' },
          ],
        } 
      case 'OWNER':
        return {
          bottomText: [
            { id: 0, step: 'CONFIRM', text: '오픈 검토 중' },
            { id: 1, step: 'OPEN', text: '오픈' },
          ],
        }
    };
  };

  const handleSpotRejectedNotice = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: (
          <SpotStatusRejectedSheet
            items={item}
            onSubmit={()=> {}}
          />
        )
      })
    )
  };

  return (
    <Container>
      <StatusBoradWrapper rejected={item?.rejected}>
        {
          item?.rejected || item?.trialUserCount! >= item?.trialTargetUserCount! ? (
            <>
              <TextH4B padding="24px 24px 16px 24px">{spotOpenRejectedText()?.title}</TextH4B>
              <TextB3R padding="0 24px 0 24px" textDecoration='underline' pointer onClick={handleSpotRejectedNotice}>오픈 미진행 안내 보기</TextB3R>
            </>
          ) : (
            <>
              <TextH4B padding="24px 24px 16px 24px">{progressStepType()?.title}</TextH4B>
              {
                item?.step === 'TRIAL' ? (
                  progressStepType()?.subtitle && 
                  <TextB3R padding="0 24px 0 24px">
                    <Text12>{`${formtrialStart} ~ ${formtrialEnd}`}</Text12>
                    {progressStepType()?.subtitle}
                  </TextB3R>
                ) : (
                  progressStepType()?.subtitle && 
                    <TextB2R padding="0 24px 0 24px">{progressStepType()?.subtitle}</TextB2R>
                )
              }
            </>
          )
        }
        <ProgressWrapper>
          <Row />
          <BarWrapper type={item?.type}>
            <FlexBetween>
              {
                typeBottomTemp()?.bottomText.map((i, idx) => {
                  // TODO : 프라이빗 step open_confirm 없음 변경필요
                  const selectedStep = typeBottomTemp()?.bottomText.find(x => x.step === item?.step);
                  return (
                    <StepWrapper key={idx}>
                      {
                        !item.rejected &&
                        (item?.step === 'TRIAL' || item?.step === 'RECRUITING') && 
                        selectedStep?.id === idx &&
                      <TooltipWrapper type={item?.step}>
                        <EventTooltip
                          message={`현재 ${item?.recruitingCount}명 참여 중`}
                          bgColor={theme.black}
                          color={theme.white}
                          minWidth="99px"
                        />
                      </TooltipWrapper>
                      }
                      <ImgWrapper>
                        {
                          !item.rejected &&
                          selectedStep?.id === idx &&
                          <Img src={`${IMAGE_S3_DEV_URL}${progressStepType()?.icon}`} />
                        }
                      </ImgWrapper>
                      <Text isSelected={!item.rejected && selectedStep?.id === idx}>{i?.text}</Text>
                    </StepWrapper>
                    )
                })
              }
            </FlexBetween>              
          </BarWrapper>
        </ProgressWrapper>
      </StatusBoradWrapper>
    </Container>
  );
};

const Container = styled.section``;

const StatusBoradWrapper = styled.section<{rejected?: boolean}>`
  width: 100%;
  color: ${theme.white};
  ${({ rejected }) => {
    if (rejected) {
      return css `
        background: ${theme.greyScale45};
      `;
    } else {
      return css `  
        background: ${theme.brandColor};
      `;
    };
  }}
`;

const ProgressWrapper = styled.div`
  width: 100%;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const ImgWrapper = styled.div`
  width: 40px;
  height: 40px;
`;
const Img = styled.img`
  width: 100%;
`;

const Text = styled.span<{isSelected?: boolean}>`
  font-size: 12px;
  letter-spacing: -0.4;
  font-weight: ${({isSelected}) => isSelected ? 700 : 400};
  line-height: 18px;
  padding-top: 12px;
`;

const Text12 = styled.span`
  ${textH6};
`;

const TooltipWrapper = styled.div<{type?: string}>`
  position: relative;
  z-index: 0;
  ${({ type }) => {
    if(type === 'RECRUITING') {
      return css `
        bottom: 17px;
        right: 72px;
      `;
    } else if(type === 'TRIAL') {
      return css `
        bottom: 17px;
        right: 72px;
      `;
    }
  }}
`;

const BarWrapper = styled.div<{type?: string}>`
  ${({type}) => {
    if(type === 'OWNER'){
      return css `
      padding: 45px 100px 24px 100px;
      `  
    } else {
      return css `
        padding: 45px 60px 24px 60px;
      `
    }
  }}
`;

const Row = styled.div`
  width: 100%;
  position: relative;
  top: 89px;
  border-top: 1px solid ${theme.white};
`;

export default SpotStatusDetailProgressBar;