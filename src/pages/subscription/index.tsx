import { InfoCard } from '@components/Pages/Subscription';
import { MySubsList } from '@components/Pages/Subscription';
import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { theme } from '@styles/theme';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';
import SubsCalendar from '@components/Calendar/SubsCalendar';

const SubscriptiopPage = () => {
  const { isLoginSuccess, me } = useSelector(userForm);
  // TODO : 구독 리스트 api 추후 리액트 쿼리로 변경
  const [subsList, setSubsList] = useState([{}]);
  const onClick = () => {
    let message = {
      cmd: 'webview-route-onBoarding',
      data: {
        msg: '온보딩 페이지로 이동',
      },
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  };
  const goToRegularSpot = () => {
    router.push('/subscription/products?tab=spot');
  };
  const goToRegularDawn = () => {
    router.push('/subscription/products?tab=dawn');
  };
  return (
    <Container>
      <InfoCard subsList={subsList} />
      {subsList && <MySubsList />}

      <SubsListContainer>
        <TitleBox>
          <div className="row">
            <TextH3B>프코스팟 정기구독</TextH3B>
            <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToRegularSpot}>
              더보기
            </TextH6B>
          </div>
          <TextB2R color={theme.greyScale65}>매주 무료배송으로 스팟에서 픽업해보세요</TextB2R>
        </TitleBox>
        <ListBox />
      </SubsListContainer>
      <SubsListContainer>
        <TitleBox>
          <div className="row">
            <TextH3B>새벽/택배 정기구독</TextH3B>
            <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToRegularDawn}>
              더보기
            </TextH6B>
          </div>
          <TextB2R color={theme.greyScale65}>매주 무료배송으로 스팟에서 픽업해보세요</TextB2R>
        </TitleBox>
        <ListBox />
      </SubsListContainer>
      <Banner>정기구독 안내 배너</Banner>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 68px;
`;
const SubsListContainer = styled.article`
  padding-bottom: 44px;
`;
const TitleBox = styled.div`
  padding: 0 24px 24px;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }
`;
const ListBox = styled.div`
  width: 100%;
  height: 250px;
  background-color: #f2f2f2;
`;
const Banner = styled.div`
  width: 100%;
  height: 96px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SubscriptiopPage;
