import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme, FlexRow, homePadding, FlexBetweenStart, FlexCol, FlexBetween } from '@styles/theme';
import TextInput from '@components/Shared/TextInput';
import { Button } from '@components/Shared/Button';
import BorderLine from '@components/Shared/BorderLine';
import { TextH6B, TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { TabList } from '@components/Shared/TabList';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPointHistoryApi, getPointApi } from '@api/point';
import { postPromotionCodeApi } from '@api/promotion';
import { IPointHistories } from '@model/index';
import { getCustomDate } from '@utils/destination';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';

const TAB_LIST = [
  { id: 1, text: '적립', value: 'save', link: '/save' },
  { id: 2, text: '사용/소멸', value: 'use', link: '/use' },
];

const PointPage = () => {
  const [isShow, setIsShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('/save');
  const codeRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: pointHistory, isLoading } = useQuery(
    ['getPointHistoryList', selectedTab],
    async () => {
      const types = formatTanNameHandler(selectedTab);
      const params = {
        page: 1,
        size: 10,
        types,
      };
      const { data } = await getPointHistoryApi(params);
      if (data.code === 200) {
        return data.data.pointHistories;
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: points, isLoading: pointLoading } = useQuery(
    'getPoint',
    async () => {
      const { data } = await getPointApi();
      if (data.code === 200) {
        return data.data;
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { mutate: mutatePostPromotionCode } = useMutation(
    async () => {
      if (codeRef.current) {
        const reqBody = {
          code: codeRef?.current?.value,
          reward: 'POINT',
        };
        const { data } = await postPromotionCodeApi(reqBody);
        if (data.code === 200) {
          return dispatch(
            SET_ALERT({
              alertMessage: '등록을 완료했어요!',
              submitBtnText: '확인',
            })
          );
        }
      }
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getPoint');
        await queryClient.refetchQueries('getPointHistoryList');
      },
      onError: async (error: any) => {
        let alertMessage = '';
        if (error.code === 2202) {
          alertMessage = '이미 등록된 프로모션 코드예요.';
        } else if (error.code === 1105) {
          alertMessage = '유효하지 않은 코드예요. 다시 한번 확인해 주세요.';
        }
        return dispatch(
          SET_ALERT({
            alertMessage,
            submitBtnText: '확인',
          })
        );
      },
    }
  );

  const formatTanNameHandler = (tabName: string): string => {
    return tabName === '/save' ? 'SAVE' : 'EXPIRATION,USE';
  };

  const selectTabHandler = (tabItem: any) => {
    setSelectedTab(tabItem.link);
  };

  if (isLoading || pointLoading) {
    return <div>로딩</div>;
  }

  const targetIndex = pointHistory?.find((item) => {
    let currentYear = new Date().getFullYear();
    const itemYear = new Date(item.createdAt).getFullYear();
    if (currentYear !== itemYear) {
      return item;
    }
  })?.id!;

  return (
    <Container>
      <Wrapper>
        <FlexRow padding="24px 0 0 0">
          <TextInput placeholder="프로모션 코드를 입력해주세요." ref={codeRef} />
          <Button width="30%" margin="0 0 0 8px" onClick={() => mutatePostPromotionCode()}>
            등록하기
          </Button>
        </FlexRow>
        <BorderLine height={1} margin="24px 0" />
        <FlexBetweenStart padding="0 24px">
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>사용 가능한 포인트</TextH6B>
            <TextH5B color={theme.brandColor} padding="6px 0 0 0">
              {points?.availablePoint} P
            </TextH5B>
          </FlexCol>
          <FlexCol width="50%">
            <TextH6B color={theme.greyScale65}>7일 이내 소멸 예정 포인트</TextH6B>
            <TextH5B padding="6px 0 0 0"> {points?.expirePoint} P</TextH5B>
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
        <TabList tabList={TAB_LIST} onClick={selectTabHandler} selectedTab={selectedTab} />
      </Wrapper>
      <ScrollView>
        {pointHistory?.map((item: IPointHistories, index: number) => {
          if (targetIndex === item.id) {
            const itemYear = new Date(item.createdAt).getFullYear();
            return (
              <FlexCol key={index}>
                <BorderLine height={1} />
                <TextH5B color={theme.greyScale45} center padding="8px 0 0 0">
                  {itemYear}년
                </TextH5B>
                <PointItem
                  content={item.content}
                  value={item.value}
                  createdAt={item.createdAt}
                  expiredDate={item.expiredDate}
                  key={index}
                />
              </FlexCol>
            );
          }
          return (
            <PointItem
              content={item.content}
              value={item.value}
              createdAt={item.createdAt}
              expiredDate={item.expiredDate}
              key={index}
            />
          );
        })}
      </ScrollView>
    </Container>
  );
};

const PointItem = React.forwardRef(
  ({ content, value, createdAt, expiredDate }: any, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { dayFormatter: formatCreatedAt } = getCustomDate(new Date(createdAt));
    const { dayFormatter: formatExpiredDate } = getCustomDate(new Date(expiredDate));

    return (
      <FlexCol padding="0 0 24px 0" ref={ref}>
        <FlexBetween padding="0 0 6px 0">
          <TextH5B>{content}</TextH5B>
          <TextH5B>{value}</TextH5B>
        </FlexBetween>
        <FlexBetween>
          <TextB2R>{formatCreatedAt}</TextB2R>
          {expiredDate && <TextB2R color={theme.greyScale45}> {formatExpiredDate} 소멸예정</TextB2R>}
        </FlexBetween>
      </FlexCol>
    );
  }
);
PointItem.displayName = 'PointItem';

const Container = styled.div`
  height: calc(100vh - 114px);
`;
const Wrapper = styled.div`
  ${homePadding}
  position: relative;
  width: 100%;
  /* left: calc(50%);
  right: 0; */
  background-color: white;
  max-width: ${breakpoints.mobile}px;

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

const ScrollView = styled.div`
  padding: 24px 25px;
  overflow-y: scroll;
  height: calc(100vh - 379px);
`;
// const ScrollView = styled.div<{ customMargin?: number }>`
//   padding: 24px 25px;
//   overflow-y: scroll;
//   height: 100%;
//   padding-top: ${({ customMargin }) => customMargin && customMargin}px;
// `;

export default PointPage;
