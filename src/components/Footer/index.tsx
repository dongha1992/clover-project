import React, { useState } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R, TextB3R, TextH6B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import { SVGIcon } from '@utils/common';
import { SITE_INFO_TITLE } from '@constants/footer';
import { breakpoints } from '@utils/common/getMediaQuery';
import { theme } from '@styles/theme';
import SlideToggle from '@components/Shared/SlideToggle';

const Footer = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <Container>
      <TextH5B>고객센터</TextH5B>
      <TimeInfoWrapper>
        <TextB2R color={theme.greyScale65}>평일 9:00 - 18:00 (점심시간 13:00 - 14:00)</TextB2R>
        <TextB2R color={theme.greyScale65}>토요일 9:00 - 13:00 (홈페이지 채팅문의만 운영)</TextB2R>
        <TextB2R color={theme.greyScale65}>공휴일 휴무</TextB2R>
      </TimeInfoWrapper>
      <ButtonWrapper>
        <Button width="148px">채팅문의</Button>
      </ButtonWrapper>
      <FlexWrapper onClick={() => setIsShow(!isShow)}>
        <TextH5B padding="0px 9px 0 0">사업자 정보</TextH5B>
        <SVGWrapper>
          <SVGIcon name={isShow ? 'triangleUp' : 'triangleDown'} />
        </SVGWrapper>
      </FlexWrapper>
      <SlideToggle state={isShow} duration={0.5}>
        <BossInfo>
          <TextB3R>대표 : 정유석</TextB3R>
          <TextB3R>주소 : 서울특별시 성동구 왕십리로 115, </TextB3R>
          <TextB3R>헤이그라운드 서울숲점 7층</TextB3R>
          <TextB3R>사업자등록번호 : 883-81-00307</TextB3R>
          <TextB3R padding="0 0 8px 0">통신판매업신고 : 제 2016-서울용산-00657</TextB3R>
          <TextB3R>제휴문의 : biz@freshcode.me</TextB3R>
          <TextB3R>카카오ID : @프레시코드-freshcode</TextB3R>
          <TextB3R>단체주문문의 : order@freshcode.me</TextB3R>
        </BossInfo>
      </SlideToggle>
      <SiteInfo>
        {SITE_INFO_TITLE.map((item, index) => {
          return <TextH6B key={index}>{item.title}</TextH6B>;
        })}
      </SiteInfo>
      <LinkIconWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="instaLink" />
        </SVGWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="facebookLink" />
        </SVGWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="youtubeLink" />
        </SVGWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="naverBlogLink" />
        </SVGWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="naverPostLink" />
        </SVGWrapper>
        <SVGWrapper className="link">
          <SVGIcon name="channelTalkLink" />
        </SVGWrapper>
      </LinkIconWrapper>
    </Container>
  );
};

const Container = styled.footer`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  padding: 33px 24px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.greyScale3};
`;

const TimeInfoWrapper = styled.div`
  padding-top: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding-top: 19px;
  padding-bottom: 50px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SVGWrapper = styled.div`
  cursor: pointer;
  padding: 0 0 4px 0;
  &.link {
    padding: 0 16px 0 0;
  }
`;

const BossInfo = styled.div`
  padding-top: 9px;
  > div {
    color: ${({ theme }) => theme.greyScale65};
  }
`;

const SiteInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 25px;
  > div {
    color: ${({ theme }) => theme.greyScale65};
    cursor: pointer;
    padding-right: 16px;
  }
`;

const LinkIconWrapper = styled.div`
  display: flex;
  padding-top: 24px;
  flex-wrap: wrap;
`;

export default Footer;
