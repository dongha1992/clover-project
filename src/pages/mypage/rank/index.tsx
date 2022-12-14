import { TextH2B, TextH5B, TextB2R, TextH4B, TextB3R, TextH3B, TextB1R } from '@components/Shared/Text';
import { FlexCol, FlexRow, homePadding, theme, FlexBetween, FlexColEnd, FlexBetweenStart } from '@styles/theme';
import React from 'react';
import styled, { css } from 'styled-components';
import { Obj } from '@model/index';
import BorderLine from '@components/Shared/BorderLine';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import { onUnauthorized } from '@api/Api';
import { useQuery } from 'react-query';
import { getUserGradeApi } from '@api/user';
import { getFormatPrice } from '@utils/common';

const RankPage = () => {
  const { me, isLoginSuccess } = useSelector(userForm);

  const {
    data: userGrade,
    error,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['userGrade'],
    async () => {
      const { data } = await getUserGradeApi();
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
      onError: () => {},
      onSuccess: (data) => {},
    }
  );

  return (
    <Container>
      {isLoginSuccess ? (
        <Wrapper>
          <FlexCol padding="24px 0 32px 0">
            <TextH2B>{me?.nickname}님은</TextH2B>
            <FlexRow>
              <TextH2B color={theme.brandColor}>{userGrade?.userGrade.name}</TextH2B>
              <TextH2B padding="0 0 0 4px">회원이에요.</TextH2B>
            </FlexRow>
          </FlexCol>
          <FlexCol>
            <UserRankInfo title="적립금" count={userGrade?.userGrade?.benefit.accumulationRate! * 100} id={1} />
          </FlexCol>
          <BorderLine height={1} margin="24px 0" />
          <FlexCol padding="0 0 48px 0">
            <FlexRow>
              <TextB1R padding="0 4px 0 0">다음 달 예상 등급은</TextB1R>
              <TextH4B>{userGrade?.expectedUserGrade?.name!}</TextH4B>,
            </FlexRow>
            {userGrade?.expectedUserGrade.isLast ? (
              <FlexCol padding="0 0 0 0">
                <FlexRow>
                  <TextH4B>{userGrade?.expectedUserGrade.name}</TextH4B>
                  <TextB1R padding="0 4px 0 0">으로 남아주실 거죠?</TextB1R>
                </FlexRow>
              </FlexCol>
            ) : (
              <FlexRow>
                <TextH4B color={theme.brandColor}>
                  {getFormatPrice(String(userGrade?.expectedUserGrade?.nextUserGrade?.insufficientAmount!))}원
                </TextH4B>
                <TextB1R padding="0 0 0 4px">더 구매하면 </TextB1R>
                <TextH4B>{userGrade?.expectedUserGrade?.nextUserGrade?.name!}</TextH4B>
                <TextB1R>이 돼요</TextB1R>
              </FlexRow>
            )}
            <TextB3R padding="8px 0 0 0" color={theme.greyScale65}>
              (기준 결제금액에 할인, 포인트, 취소 금액은 제외됩니다.)
            </TextB3R>
          </FlexCol>
        </Wrapper>
      ) : (
        <Wrapper>
          <FlexCol padding="24px 0 48px 0">
            <TextH2B>
              프레시코드 회원이면 누구나! <br />
              특별한 등급 혜택을 받으세요!
            </TextH2B>
            <TextH5B
              color={theme.greyScale65}
              textDecoration="underline"
              onClick={() => onUnauthorized()}
              margin="16px 0 0 0"
              pointer
            >
              로그인 후 등급 혜택 받기
            </TextH5B>
          </FlexCol>
        </Wrapper>
      )}
      <BrandColor5>
        <Wrapper>
          <TextH3B padding="32px 0 29px 0">프레시코드 회원 등급 혜택</TextH3B>
          <FlexCol>
            <Card title="적립금" brandText="최대 1.5% 적립" desc="(등급별 구매 금액의 최대 2% 적립)" />
            <Card title="혜택" brandText="생일축하 쿠폰" desc="(단, 마케팅 정보 수신 동의 필수)" />
          </FlexCol>
        </Wrapper>
      </BrandColor5>
      <PaddingWrapper>
        {userGrade?.userGrades.map((item, index) => {
          let isLast = false;
          if (index === userGrade?.userGrades.length - 1) {
            isLast = true;
          }
          return <RankInfo name={item.name} desc={item.description} key={index} isLast={isLast} />;
        })}
      </PaddingWrapper>
      <PleaseCheck>
        <TextH5B color={theme.greyScale65} padding="24px 0 0 0">
          확인해주세요!
        </TextH5B>
        <BorderLine height={1} margin="16px 0" />
        <FlexRow>
          <Dot />
          <TextB3R color={theme.greyScale65}>매월 1일 승급된 등급에 해당하는 쿠폰 자동지급</TextB3R>
        </FlexRow>
        <FlexRow>
          <Dot />
          <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
            등급혜택쿠폰은 매월 1일부터 말일까지 사용 가능
          </TextB3R>
        </FlexRow>
        <FlexRow>
          <Dot flexStart />
          <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
            주문 시점 등급 혜택 기준의 적립 포인트를 / 주문완료(*마지막 배송까지 완료) 시점에 적립
          </TextB3R>
        </FlexRow>
        <FlexRow>
          <Dot />
          <TextB3R color={theme.greyScale65} padding="2px 0 0 0">
            유의사항
          </TextB3R>
        </FlexRow>
      </PleaseCheck>
    </Container>
  );
};

export const UserRankInfo = ({ id, title, count }: any) => {
  const isDiscountInfo = id === 2;
  return (
    <GreyBackground>
      <FlexBetween padding="16px">
        <TextH5B>{title}</TextH5B>
        <TextH5B color={theme.brandColor}>
          {count}% {isDiscountInfo && '(2만원 이상 구매 시)'}
        </TextH5B>
      </FlexBetween>
    </GreyBackground>
  );
};

export const Card = ({ title, brandText, desc }: any) => {
  return (
    <WhiteBox>
      <FlexBetweenStart padding="16px">
        <TextH5B>{title}</TextH5B>
        <FlexColEnd>
          <TextH5B color={theme.brandColor}>{brandText}</TextH5B>
          <TextB3R padding="4px 0 0 0">{desc}</TextB3R>
        </FlexColEnd>
      </FlexBetweenStart>
    </WhiteBox>
  );
};

export const RankInfo = ({ name, desc, benefit1, benefit2, isLast }: any) => {
  return (
    <FlexCol>
      <TextH3B>{name}</TextH3B>
      <TextB3R color={theme.greyScale65} margin="6px 0 0 0">
        {desc}
      </TextB3R>
      <FlexCol padding="14px 0 0 0">
        {benefit1 && (
          <FlexRow>
            <Dot />
            <TextB2R>{benefit1}</TextB2R>
          </FlexRow>
        )}
        {benefit2 && (
          <FlexRow>
            <Dot />
            <TextB2R>{benefit2}</TextB2R>
          </FlexRow>
        )}
      </FlexCol>
      {!isLast && <BorderLine height={1} margin="24px 0" />}
    </FlexCol>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

const GreyBackground = styled.div`
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const BrandColor5 = styled.div`
  background-color: ${theme.brandColor5};
  width: 100%;
  padding-bottom: 24px;
`;

const WhiteBox = styled.div`
  background-color: ${theme.white};
  margin-bottom: 8px;
  border-radius: 8px;
`;

const PaddingWrapper = styled.div`
  padding: 48px 40px;
`;

const Dot = styled.div<{ flexStart?: boolean }>`
  display: flex;
  background-color: ${theme.black};
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: 0px 8px;
  ${({ flexStart }) => {
    if (flexStart) {
      return css`
        align-self: flex-start;
        margin-top: 4px;
        padding: 1px;
      `;
    }
  }}
`;

const PleaseCheck = styled.div`
  background-color: ${theme.greyScale3};
  ${homePadding}
  padding-bottom: 24px;
`;

export default RankPage;
