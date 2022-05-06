import React, {ReactElement} from 'react';
import styled from 'styled-components';
import { theme, FlexStart, FlexBetween } from '@styles/theme';
import { TextH5B, TextB3R, TextH6B, TextH4B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { IEditRegistration } from '@model/index';

interface IProps {
  items: IEditRegistration[];
  onClick: (id: number | undefined) => void;
}
const SpotStatusList = ({ items, onClick }: IProps): ReactElement => {

  const spotStatusStep = (step: string | undefined) => {
    switch(step) {
      case 'CONFIRM':
        return '검토 중'
      case 'RECRUITING':
        return '모집 중'
      case 'TRIAL':
        return '트라이얼 진행 중'
      case 'OPEN':
        return '오픈완료'
      case 'OPEN_CONFIRM': 
        return '오픈 검토 중'
      case 'REJECTED':
        return '오픈 미진행'
    };
  };

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

  return (
    <Container>
      {items?.map((i, idx) => {
        return (
          <>
            <Wrppaer key={idx}>
              <FlexBetween margin="0 0 6px 0">
                <Flex>
                  <TextH4B color={theme.black} margin="0 8px 0 0">
                    {spotStatusStep(i?.step)}
                  </TextH4B>
                  <Tag color={theme.brandColor} backgroundColor={theme.brandColor5P}>
                    {spotType(i?.type)}
                  </Tag>
                </Flex>
                <TextH6B color={theme.greyScale65} textDecoration="underline" pointer onClick={() => onClick(i?.id)}>
                  신청상세 보기
                </TextH6B>
              </FlexBetween>
              <TextH5B>{i?.placeName}</TextH5B>
              <TextB3R>{`${i?.location.address} ${i?.location.addressDetail}`}</TextB3R>
              {(i?.step ==='TRIAL') || (i?.step ==='OPEN_CONFIRM') || (i?.step ==='RECRUITING') && (
                <FlexStart margin="4px 0 0 0">
                  <SVGIcon name="people" />
                  <TextH6B margin="0 0 0 6px" color={theme.brandColor}>{`${i?.recruitingCount}/5명 참여 중`}</TextH6B>
                </FlexStart>
              )}
              {i?.step === 'TRIAL' && (
                <Button border color={theme.black} backgroundColor={theme.white} margin="16px 0 0 0">
                  오픈 참여 공유하고 포인트 받기
                </Button>
              )}
            </Wrppaer>
            <Row />
          </>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 70px;
`;

const Wrppaer = styled.div``;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 24px 0;
  &: last-child {
    border: none;
  }
`;

export default SpotStatusList;
