import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { IMAGE_S3_DEV_URL } from '@constants/mock';
import { SVGIcon } from '@utils/common';

interface IParams {
  type: string;
};

const CONTENT_TEXT = [
        {
          url: '/img_spot_review.png',
          title: '1. 제출한 신청서를 검토 중이에요.',
          desc: '트라이얼 진행을 위해 신청한 장소의 배송 적합성을 확인해요.',
        },
        {
          url: '/img_spot_trial.png',
          title: '2. 트라이얼 2주간 임시로 사용 가능해요.',
          desc: '신청한 장소로 트라이얼 2주간 5명 이상의 고객이 배송완료해야 다음 단계로 넘어갈 수 있어요. 신청자와 참여자 모두에게 혜택을 제공하니 배송비 무료로 트라이얼 주문해 보세요! (단, 트라이얼은 구독 주문할 수 없어요.)',
        },
        {
          url: '/img_spot_open_review.png',
          title: '3. 최종 오픈을 위해 검토 중이에요.',
          desc: '트라이얼 2주가 종료되면 기간동안 운영, 배송에 발생한 이슈를 확인하고 최종 오픈을 위한 검토를 진행합니다.',
        },
        {
          url: '/img_spot_open.png',
          title: '4. 프코스팟을 오픈 완료했어요.',
          desc: '오픈완료 시점부터 정상적으로 프코스팟을 사용할 수 있으니 배송비 무료로 스팟배송을 이용해 보세요!',
          notice: {
            title: '프코스팟 오픈 혜택 받아가세요!',
            desc: ['•신청자는 본인을 제외한 참여자(배송완료) 인원 당 3,000P (최대 150,000P)', '•신청자를 제외한 모든 참여자는 3,000P'],
            noticeIcon: 'pointGreen18',
          },
        },
        {
          url: '/img_spot_private_retry.png',
          icon: 'exclamationMark',
          title: '아쉽지만 오픈 미진행될 수 있어요.',
          desc: '트라이얼 모집인원이 부족하거나 배송, 출입 등의 이슈로 운영 조건을 충족하지 못했을 때 미진행으로 처리돼요.',
          notice: {
            title: '트라이얼 모집 실패로 오픈 미진행되었다면?',
            desc: ['오픈 미진행된 시점으로 30일 후 동일한 장소로 트라이얼 재신청할 수 있어요. 재신청 기회는 최대 2회, 모집인원은 0명으로 다시 시작해요!'],
          }
        },
];  

const OpenInfo = ({type}: IParams) => {
  return (
    <Container>
      {
        CONTENT_TEXT.map((i, idx) => {
          return (
            <ContentTextWrapper key={idx}>
              <Img src={`${IMAGE_S3_DEV_URL}${i.url}`} />
              <Wrapper>
                {
                  i.icon && (
                    <SVGIcon name={i?.icon} />
                  )
                }
                <TextH5B margin='0 0 0 4px'>{i.title}</TextH5B>
              </Wrapper>
              <TextB3R color={theme.greyScale65}>{i.desc}</TextB3R>
              {
                i.notice && (
                  <NoticeWrapper>
                    <Contetn>
                      {
                        i.notice.noticeIcon && (
                          <SVGIcon name={i.notice.noticeIcon} />
                        )
                      }
                      <TextH5B margin='0 0 8px 4px' color={theme.brandColor}>{i.notice.title}</TextH5B>
                    </Contetn>
                    {
                      i.notice.desc.map((j, idx) => {
                        return (
                          <TextB3R key={idx} color={theme.brandColor}>{j}</TextB3R>
                        )
                      })
                    }
                  </NoticeWrapper>
                )
              }
            </ContentTextWrapper>
          )
        })
      }
    </Container>
  )
};

const Container = styled.div`
  padding: 24px;
  background: ${theme.white};
`;

const ContentTextWrapper = styled.div`
  margin-bottom: 32px;
`;

const Wrapper = styled.div`
  display: flex;
  margin: 0 0 8px 0;
`;

const Img = styled.img`
  width: 100%;
  margin: 0 0 16px 0;
`;

const NoticeWrapper = styled.div`
  padding: 20px;
  background: ${theme.brandColor3p};
  border-radius: 8px;
  margin-top: 16px;
`;

const Contetn = styled.div`
  display: flex;
`;

export default OpenInfo;