import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  theme,
  FlexRow,
  homePadding,
  FlexBetweenStart,
  FlexCol,
  FlexBetween,
} from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import BorderLine from '@components/Shared/BorderLine';
import { TextH6B, TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/getMediaQuery';

const TAB_LIST = [
  { id: 1, text: '적립', value: 'save', link: '/save' },
  { id: 2, text: '사용/소멸', value: 'use', link: '/use' },
];

let MOCK_SAVE_POINT_HISTORY = [
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },

  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
  {
    text: '후기 작성',
    point: 3000,
    createdAt: '1월 8일 (화)',
    expiryDate: '1월 9일 (수)',
  },
];

const MOCK_USE_POINT_HISTORY = [
  {
    text: '결제 사용',
    point: 3000,
    createdAt: '10월 8일 (화)',
    expiryDate: '',
  },
];

const PointPage = () => {
  const [isShow, setIsShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('/save');
  const elementRef = useRef<HTMLDivElement>(null);

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  const customMargin = elementRef.current?.offsetTop;

  return (
    <Container>
      <Wrapper>
        <FlexRow padding="24px 0 0 0">
          <TextInput placeholder="프로모션 코드를 입력해주세요." />
          <Button width="30%" margin="0 0 0 8px">
            등록하기
          </Button>
        </FlexRow>
        <BorderLine height={1} margin="24px 0" />
        <FlexBetweenStart padding="0 24px">
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>사용 가능한 포인트</TextH6B>
            <TextH5B color={theme.brandColor} padding="6px 0 0 0">
              123123 P
            </TextH5B>
          </FlexCol>
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>
              7일 이내 소멸 예정 포인트
            </TextH6B>
            <TextH5B padding="6px 0 0 0">0 개</TextH5B>
          </FlexCol>
        </FlexBetweenStart>
        <PaddingWrapper>
          <FlexBetween>
            <TextH6B color={theme.greyScale65}>포인트 이용 안내</TextH6B>
            <div onClick={() => setIsShow(!isShow)}>
              <SVGIcon name={isShow ? 'triangleUp' : 'triangleDown'} />
            </div>
          </FlexBetween>
          {isShow && (
            <>
              <BorderLine height={1} margin="16px 0" />
              <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
                적립 포인트 유효기간
              </TextB3R>
              <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
                일부 이벤트로 지급된 포인트의 경우 별도의 유효기간
              </TextB3R>
              <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
                포인트는 보유한 계정에서만 사용하며 양도, 선물은 불가합니다.
              </TextB3R>
            </>
          )}
        </PaddingWrapper>
        <BorderLine height={8} margin="24px 0 0 0 " />
        <TabList
          tabList={TAB_LIST}
          onClick={selectTabHandler}
          selectedTab={selectedTab}
          ref={elementRef}
        />
      </Wrapper>

      <ScrollView customMargin={customMargin}>
        {MOCK_SAVE_POINT_HISTORY.map((item, index) => {
          const YearChange = index === 4;
          if (YearChange) {
            return (
              <FlexCol key={index} padding="0 0 24px 0">
                <PointItem
                  title={item.text}
                  point={item.point}
                  createdAt={item.createdAt}
                  expiryDate={item.expiryDate}
                />
                <BorderLine height={1} />
                <TextH5B color={theme.greyScale45} center padding="8px 0 0 0">
                  2022년
                </TextH5B>
              </FlexCol>
            );
          }
          return (
            <PointItem
              title={item.text}
              point={item.point}
              createdAt={item.createdAt}
              expiryDate={item.expiryDate}
              key={index}
            />
          );
        })}
      </ScrollView>
    </Container>
  );
};

const PointItem = React.forwardRef(
  (
    { title, point, createdAt, expiryDate }: any,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <FlexCol padding="0 0 24px 0" ref={ref}>
        <FlexBetween padding="0 0 6px 0">
          <TextH5B>{title}</TextH5B>
          <TextH5B>+ {point}</TextH5B>
        </FlexBetween>
        <FlexBetween>
          <TextB2R>{createdAt}</TextB2R>
          <TextB2R color={theme.greyScale45}>{expiryDate} 소멸예정</TextB2R>
        </FlexBetween>
      </FlexCol>
    );
  }
);

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
  position: fixed;
  width: 100%;
  left: calc(50%);
  right: 0;
  background-color: white;
  max-width: ${breakpoints.mobile}px;
  width: 100%;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const PaddingWrapper = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const ScrollView = styled.div<{ customMargin?: number }>`
  padding: 24px 25px;
  overflow-y: scroll;
  height: 100%;
  padding-top: ${({ customMargin }) => customMargin && customMargin}px;
`;

export default PointPage;
