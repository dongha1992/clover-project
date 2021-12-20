import React from 'react';
import styled from 'styled-components';
import {
  TextH2B,
  TextB1B,
  TextH5B,
  TextH6B,
  TextB2R,
} from '@components/Shared/Text';
import { theme, homePadding, fixedBottom, FlexBetween } from '@styles/theme';
import { useRouter } from 'next/router';
import Button from '@components/Shared/Button';

function submit() {
  const router = useRouter();
  const { type } = router.query;

  const goToFinish = (): void => {
    router.push({
      pathname: '/spot/register/submit/finish',
      query: { type },
    });
  };

  return (
    <Container>
      <Wrapper>
        <TextH2B margin="0 0 45px 0">{'신청 완료 전\n내용을 확인해요'}</TextH2B>
        <ContentWrapper>
          <TextB1B margin="0 0 24px 0">장소 정보</TextB1B>
          <Content>
            <FlexBetween>
              <TextH5B margin="0 0 8px 0">주소</TextH5B>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                변경하기
              </TextH6B>
            </FlexBetween>
            <TextB2R>경기도 성남시 분당구 대왕판교로 477 1122</TextB2R>
          </Content>
          <Content>
            <FlexBetween>
              <TextH5B margin="0 0 8px 0">상호명</TextH5B>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                변경하기
              </TextH6B>
            </FlexBetween>
            <TextB2R>헤이그라운드</TextB2R>
          </Content>
          <Content>
            <FlexBetween>
              <TextH5B margin="0 0 8px 0">장소 종류</TextH5B>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                변경하기
              </TextH6B>
            </FlexBetween>
            <TextB2R>공유오피스</TextB2R>
          </Content>
        </ContentWrapper>
        {type !== 'public' && (
          <>
            <Row />
            <ContentWrapper>
              {type === 'private' ? (
                <TextB1B margin="0 0 24px 0">신청자 정보</TextB1B>
              ) : (
                <TextB1B margin="0 0 24px 0">장소 관리자 정보</TextB1B>
              )}
              <Content>
                <FlexBetween>
                  <TextH5B margin="0 0 8px 0">이름</TextH5B>
                  <TextH6B color={theme.greyScale65} textDecoration="underline">
                    변경하기
                  </TextH6B>
                </FlexBetween>
                <TextB2R>프플린</TextB2R>
              </Content>
              <Content>
                <FlexBetween>
                  <TextH5B margin="0 0 8px 0">이메일</TextH5B>
                  <TextH6B color={theme.greyScale65} textDecoration="underline">
                    변경하기
                  </TextH6B>
                </FlexBetween>
                <TextB2R>flynn@freshcode.me</TextB2R>
              </Content>
              <Content>
                <FlexBetween>
                  <TextH5B margin="0 0 8px 0">휴대폰 번호</TextH5B>
                  <TextH6B color={theme.greyScale65} textDecoration="underline">
                    변경하기
                  </TextH6B>
                </FlexBetween>
                <TextB2R>01012341234</TextB2R>
              </Content>
              {type === 'normal' && (
                <Content>
                  <FlexBetween>
                    <TextH5B margin="0 0 8px 0">직급/호칭</TextH5B>
                    <TextH6B
                      color={theme.greyScale65}
                      textDecoration="underline"
                    >
                      변경하기
                    </TextH6B>
                  </FlexBetween>
                  <TextB2R>사장님</TextB2R>
                </Content>
              )}
            </ContentWrapper>
          </>
        )}
        <FixedButton onClick={goToFinish}>
          <Button borderRadius="0">신청서 제출하기</Button>
        </FixedButton>
      </Wrapper>
    </Container>
  );
}

const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding}
`;

const ContentWrapper = styled.section``;

const Content = styled.div`
  margin-bottom: 24px;
`;

const FixedButton = styled.section`
  ${fixedBottom}
`;

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid ${theme.greyScale6};
  margin: 16px 0;
`;

export default submit;
