import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import Image from 'next/image';

interface IParams {
  type: string;
};

interface ISpotNotice {
  url: string;
  title: string;
  desc: string;
  icon?: string;
  notice?: {
    title?: string | undefined;
    desc?: string[] | undefined;
    noticeIcon?: string | undefined;
  }
}

const OpenInfo = ({type}: IParams) => {
  const spotNoticeContents = (): ISpotNotice[] | undefined => {
    switch(type){
      case 'PRIVATE':
        return [
          {
            url: 'img_spot_review.png',
            title: '1. 제출한 신청서를 검토 중이에요.',
            desc: '트라이얼 진행을 위해 신청한 장소의 배송 적합성을 확인해요.',
          },
          {
            url: 'img_spot_trial.png',
            title: '2. 트라이얼 2주간 임시로 사용 가능해요.',
            desc: '신청한 장소로 트라이얼 2주간 5명 이상의 고객이 배송완료해야 다음 단계로 넘어갈 수 있어요. 신청자와 참여자 모두에게 혜택을 제공하니 배송비 무료로 트라이얼 주문해 보세요! (단, 트라이얼은 구독 주문할 수 없어요.)',
          },
          {
            url: 'img_spot_open_review.png',
            title: '3. 최종 오픈을 위해 검토 중이에요.',
            desc: '트라이얼 2주가 종료되면 기간동안 운영, 배송에 발생한 이슈를 확인하고 최종 오픈을 위한 검토를 진행합니다.',
          },
          {
            url: 'img_spot_open.png',
            title: '4. 프코스팟을 오픈 완료했어요.',
            desc: '오픈완료 시점부터 정상적으로 프코스팟을 사용할 수 있으니 배송비 무료로 스팟배송을 이용해 보세요!',
            notice: {
              title: '프코스팟 오픈 혜택 받아가세요!',
              desc: ['신청자는 본인을 제외한 참여자(배송완료) 인원 당 3,000P (최대 150,000P)', '신청자를 제외한 모든 참여자는 3,000P'],
              noticeIcon: 'pointGreen18',
            },
          },
          {
            url: 'img_spot_private_retry.png',
            icon: 'exclamationMark',
            title: '아쉽지만 오픈 미진행될 수 있어요.',
            desc: '트라이얼 모집인원이 부족하거나 배송, 출입 등의 이슈로 운영 조건을 충족하지 못했을 때 미진행으로 처리돼요.',
            notice: {
              title: '트라이얼 모집 실패로 오픈 미진행되었다면?',
              desc: ['오픈 미진행된 시점으로 30일 후 동일한 장소로 트라이얼 재신청할 수 있어요. 재신청 기회는 최대 2회, 모집인원은 0명으로 다시 시작해요!'],
            }
          },
        ];
      case 'PUBLIC':
        return [
          {
            url: 'img_spot_join.png',
            title: '1. 함께 오픈할 참여자를 모집 중이에요.',
            desc: '신청한 장소를 프코스팟으로 운영하기 위해 많은 유저의 참여를 받는 기간이에요. 참여자가 많을수록 사장님을 설득하여 오픈 확률이 올라가요!',
          },
          {
            url: 'img_spot_visit.png',
            title: '2. 오픈을 검토 중이에요.',
            desc: '최대 100명의 유저가 참여하면 프코매니저가 직접 장소를 방문하여 사장님과 오픈 검토를 진행해요.',
            notice: {
              desc: ['100명 모집 전에도 운영 검토를 통해 미리 방문하여 오픈할 수 있어요.', '많은 유저분들의 참여에도 신청한 장소의 여건 상 오픈이 어려우면 주변 다른 장소로 대체되어 프코스팟을 오픈할 수도 있어요.'],
            },
          },
          {
            url: 'img_spot_open_public.png',
            title: '3. 프코스팟을 오픈 완료했어요.',
            desc: '오픈완료 시점부터 정상적으로 프코스팟을 사용할 수 있으니 배송비 무료로 스팟배송을 이용해 보세요!',
          },
          {
            url: 'img_spot_public_failed.png',
            icon: 'exclamationMark',
            title: '아쉽지만 오픈 미진행될 수 있어요.',
            desc: '참여자 수가 부족하거나 배송, 출입, 운영 등의 이슈로 운영 조건을 충족하지 못한 경우 오픈 미진행 처리돼요.\n(주변의 다른 장소로 대체 오픈한 경우에도 해당 신청은 미진행으로 처리돼요.)',
          },
        ];
      case 'OWNER':
        return [
          {
            url: 'img_spot_visit.png',
            title: '1. 오픈을 검토 중이에요.',
            desc: '스팟 오픈을 위한 적합성을 판단하고 조율하는 단계예요.제출한 신청서를 검토하고 프코 매니저가 직접 방문하여 사장님과 인터뷰를 진행할 예정이에요.',
          },
          {
            url: 'img_spot_open_public.png',
            title: '2. 프코스팟을 오픈 완료했어요.',
            desc: '오픈완료 시점부터 정상적으로 프코스팟을 운영할 수 있어요!',
          },
          {
            url: 'img_spot_public_failed_owner.png',
            icon: 'exclamationMark',
            title: '아쉽지만 오픈 미진행될 수 있어요.',
            desc: '배송, 출입 등의 이슈로 운영 조건을 충족하지 못하거나 운영에 필요한 협의가 불충족된 경우 오픈 미진행으로 처리돼요. 별도의 페널티는 없어요!',
          },
        ];
    }
  };

  return (
    <Container>
      {
        spotNoticeContents()?.map((i, idx) => {
          return (
            <ContentTextWrapper key={idx}>
              <ImageWrapper>
                <Image 
                  src={`/images/${i.url}`}
                  width={312}
                  height={174}
                  layout="responsive"
                  alt="프코스팟 신청 안내 이미지"
                />
              </ImageWrapper>

              <Wrapper>
                {
                  i.icon && (
                    <SVGIcon name={i?.icon} />
                  )
                }
                <TextH5B margin='0 0 0 4px'>{i.title}</TextH5B>
              </Wrapper>
              <TextB2R color={theme.greyScale65}>{i.desc}</TextB2R>
              {
                i?.notice && (
                  <NoticeWrapper>
                    <Contetn>
                      {
                        i.notice?.noticeIcon && (
                          <SVGIcon name={i.notice.noticeIcon} />
                        )
                      }
                      <TextH5B margin='0 0 8px 4px' color={theme.brandColor}>{i.notice.title}</TextH5B>
                    </Contetn>
                    {
                      i.notice?.desc!.map((j, idx) => {
                        return (
                          <FlexWrapper key={idx}>
                            <Dot>•</Dot>
                            <TextB2R  color={theme.brandColor}>{j}</TextB2R>
                          </FlexWrapper>
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

const FlexWrapper = styled.div`
  display: flex;
`;

const Dot = styled.span`
  padding-top: 1px;
  color: ${theme.brandColor}
`;

const Wrapper = styled.div`
  display: flex;
  margin: 0 0 8px 0;
`;

const ImageWrapper = styled.div`
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