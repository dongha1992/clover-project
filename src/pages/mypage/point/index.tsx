import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  theme,
  FlexRow,
  homePadding,
  FlexBetweenStart,
  FlexCol,
  FlexBetween,
} from '@styles/theme';
import TextInput from '@components/TextInput';
import Button from '@components/Button';
import BorderLine from '@components/BorderLine';
import { TextH6B, TextH5B, TextB3R, TextB1R } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import TabList from '@components/TabList';

const TAB_LIST = [
  { id: 1, text: '적립', value: 'save' },
  { id: 2, text: '사용/소멸', value: 'use' },
];

function point() {
  const [isShow, setIsShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('save');

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
              0 P
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
      </Wrapper>
      <BorderLine height={8} margin="24px 0 0 0 " />
      <TabList
        tabList={TAB_LIST}
        onClick={setSelectedTab}
        selectedTab={selectedTab}
      />
    </Container>
  );
}

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const PaddingWrapper = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export default point;
