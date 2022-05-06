import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';

const CONTENT_TEXT = [
    {
      title: '검토 중',
      desc: '제출한 신청서를 검토하는 단계.\n트라이얼 진행을 위한 스팟의 배송 적합성을 확인합니다.',
    },
    {
      title: '트라이얼 진행 중',
      desc: '트라이얼 승인 후 임시 사용 가능한 스팟으로 운영됩니다.\n2주간 5명 이상의 고객이 배송완료하면 정상오픈을 위한 스텝을 진행하며, 신청자와 참여자 모두에게 혜택을 드립니다.',
    },
    {
      title: '오픈 검토 중',
      desc: '트라이얼 2주가 종료되면 기간동안 운영, 배송에 발생한 이슈를 확인하고 최종 오픈을 위한 검토를 진행합니다.',
    },
    {
      title: '오픈완료',
      desc: '오픈완료 시점부터 정상적으로 스팟을 사용할 수 있습니다.',
    },
    {
      title: '오픈 미진행',
      desc: '트라이얼 인원이 부족하거나 배송, 출입 등의 이슈로 운영조건을 충족하지 못한 스팟은 미진행으로 처리됩니다.\n미진행된 동일한 스팟은 최대 2회까지만 재신청이 가능합니다.',
    },
    {
      title: '모집 혜택',
      desc: '트라이얼 2주간 5명 이상 배송완료하여 오픈 조건을 충족하고 정상 오픈하면 혜택을 드립니다.\n신청자는 본인을 제외한 배송완료 인원당 3,000P(최대 150,000P) 지급, 신청자를 제외한 모든 참여자는 3,000P를 지급받습니다. ',
    },
  ];

const OpenInfo = () => {
  return (
    <Container>
      {
        CONTENT_TEXT.map((i, idx) => {
          return (
            <ContentTextWrapper key={idx}>
              <TextH5B margin='0 0 8px 0'>{i.title}</TextH5B>
              <TextB3R>{i.desc}</TextB3R>
            </ContentTextWrapper>
          )
        })
      }
    </Container>
  )
};

const Container = styled.div`
  padding: 24px;
  background: ${theme.greyScale3};
`;

const ContentTextWrapper = styled.div`
  margin-bottom: 24px;
`;

export default OpenInfo;