import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { TextH3B, TextH5B, TextH6B, TextB3R } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button/RadioButton';
import Tag from '@components/Shared/Tag';
import { FlexBetween, homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import Button from '@components/Shared/Button';
import Checkbox from '@components/Shared/Checkbox';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_AFTER_SETTING_DELIVERY } from '@store/cart';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip'), {
  ssr: false,
});

interface IDeliveryMethod {
  id: number;
  value: string;
  name: string;
  tag: string;
  description: string;
  feeInfo: string;
}

/*TODO: map 리팩토링 */

const DELIVERY_METHOD: any = {
  pickup: [
    {
      id: 1,
      value: 'spot',
      name: '스팟배송',
      tag: '무료배송',
      description: '- 수도권 내 오픈된 프코스팟으로 픽업 가능',
      feeInfo: '- 언제나 배송비 무료ㅣ점심 · 저녁픽업',
    },
  ],
  delivery: [
    {
      id: 2,
      value: 'morning',
      name: '새벽배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 3,
      value: 'parcel',
      name: '택배배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 4,
      value: 'quick',
      name: '퀵배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
  ],
};

const pickupPlace = {
  name: '헤이그라운드 서울숲점',
  spaceType: '프라이빗',
  address: '서울 성동구 왕십리로 115 10층',
  type: '픽업',
  availableTime: '12:00-12:30 / 15:30-18:00',
};

function DeliverInfoPage() {
  const [selectedMethod, setSelectedMethod] = useState<number>(1);
  const dispatch = useDispatch();

  const checkTermHandler = () => {};

  const goToFindAddress = () => {
    if (selectedMethod === 1) {
      router.push('/spot/search');
    } else {
      router.push('/location');
    }
  };

  const changeMethodHandler = useCallback(
    (id: number) => {
      setSelectedMethod(id);
    },
    [selectedMethod]
  );

  const finishDeliverySetting = () => {
    router.push('/cart');
    dispatch(SET_AFTER_SETTING_DELIVERY());
  };

  return (
    <Container>
      <Wrapper>
        <TextH3B padding="24px 0">배송방법</TextH3B>
        <DeliveryMethodWrapper>
          <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
            픽업
          </TextH5B>
          {DELIVERY_METHOD['pickup'].map((item: any, index: number) => {
            const isSelected = selectedMethod === item.id;
            return (
              <MethodGroup key={index}>
                <RowWrapper>
                  <RadioWrapper>
                    <RadioButton
                      isSelected={isSelected}
                      onChange={() => changeMethodHandler(item.id)}
                    />
                  </RadioWrapper>
                  <Content>
                    <FlexBetween margin="0 0 8px 0">
                      <RowLeft>
                        <TextH5B margin="0 4px 0px 8px">{item.name}</TextH5B>
                        {item.tag && (
                          <Tag
                            backgroundColor={theme.greyScale6}
                            color={theme.greyScale45}
                          >
                            {item.tag}
                          </Tag>
                        )}
                      </RowLeft>
                      {isSelected && (
                        <Tooltip
                          message={'새벽배송이 가능해요'}
                          top="25px"
                          width="160px"
                        />
                      )}
                      {index === 2 && (
                        <TextH6B color={theme.brandColor}>
                          점심배송 마감 29:30 전
                        </TextH6B>
                      )}
                    </FlexBetween>
                    <Body>
                      <TextB3R color={theme.greyScale45}>
                        {item.description}
                      </TextB3R>
                      <TextH6B color={theme.greyScale45}>
                        {item.feeInfo}
                      </TextH6B>
                    </Body>
                  </Content>
                </RowWrapper>
              </MethodGroup>
            );
          })}
          <BorderLine height={1} margin="24px 0" />
          <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
            배송
          </TextH5B>
          {DELIVERY_METHOD['delivery'].map((item: any, index: number) => {
            return (
              <MethodGroup key={index}>
                <RowWrapper>
                  <RadioWrapper>
                    <RadioButton
                      isSelected={selectedMethod === item.id}
                      onChange={() => changeMethodHandler(item.id)}
                    />
                  </RadioWrapper>
                  <Content>
                    <FlexBetween margin="0 0 8px 0">
                      <RowLeft>
                        <TextH5B margin="0 4px 0 8px">{item.name}</TextH5B>
                        {item.tag && (
                          <Tag
                            backgroundColor={theme.greyScale6}
                            color={theme.greyScale45}
                          >
                            {item.tag}
                          </Tag>
                        )}
                      </RowLeft>
                      {index === 2 && (
                        <TextH6B color={theme.brandColor}>
                          점심배송 마감 29:30 전
                        </TextH6B>
                      )}
                    </FlexBetween>
                    <Body>
                      <TextB3R color={theme.greyScale45}>
                        {item.description}
                      </TextB3R>
                      <TextH6B color={theme.greyScale45}>
                        {item.feeInfo}
                      </TextH6B>
                    </Body>
                  </Content>
                </RowWrapper>
              </MethodGroup>
            );
          })}
        </DeliveryMethodWrapper>
        <BorderLine height={8} margin="32px 0" />
        <FlexBetween>
          <TextH3B padding="0 0 14px 0">픽업지</TextH3B>
          {Object.keys(pickupPlace).length && (
            <TextH6B textDecoration="underline" color={theme.greyScale65}>
              변경하기
            </TextH6B>
          )}
        </FlexBetween>
        {!Object.keys(pickupPlace).length ? (
          <>
            <PickPlaceInfo>
              <PlaceName>
                <TextH5B padding="0 4px 0 0">{pickupPlace.name}</TextH5B>
                <Tag
                  backgroundColor={theme.brandColor5}
                  color={theme.brandColor}
                >
                  {pickupPlace.spaceType}
                </Tag>
              </PlaceName>
              <TextB3R padding="4px 0" color={theme.greyScale65}>
                {pickupPlace.address}
              </TextB3R>
              <PlaceInfo>
                <TextH6B padding="0 4px 0 0" color={theme.greyScale65}>
                  {pickupPlace.type}
                </TextH6B>
                <TextB3R color={theme.greyScale65}>
                  {pickupPlace.availableTime}
                </TextB3R>
              </PlaceInfo>
            </PickPlaceInfo>
            <CheckTerm>
              <Checkbox isSelected onChange={checkTermHandler} />
              <span className="h5B">
                <span className="brandColor">임직원 전용</span>
                스팟으로, 외부인은 이용이 불가합니다.
              </span>
            </CheckTerm>
          </>
        ) : (
          <BtnWrapper onClick={goToFindAddress}>
            <Button backgroundColor={theme.white} color={theme.black} border>
              {selectedMethod === 1 ? '픽업지 검색하기' : '배송지 검색하기'}
            </Button>
          </BtnWrapper>
        )}
      </Wrapper>
      <SettingBtnWrapper onClick={finishDeliverySetting}>
        <Button borderRadius="0">설정하기</Button>
      </SettingBtnWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;
const Wrapper = styled.div`
  width: 100%;
  ${homePadding}
`;
const DeliveryMethodWrapper = styled.div`
  width: 100%;
`;
const RadioWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  margin-top: 2px;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const RowLeft = styled.div`
  position: relative;
  display: flex;
`;
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MethodGroup = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const Body = styled.div`
  padding-left: 8px;
`;

const BtnWrapper = styled.div``;

const PickPlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
`;

const PlaceName = styled.div`
  display: flex;
  align-items: center;
`;

const PlaceInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CheckTerm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding-bottom: 56px;
  .h5B {
    padding-top: 2px;
    font-size: 12px;
    letter-spacing: -0.4px;
    line-height: 18px;
    color: ${theme.greyScale65};
    .brandColor {
      color: ${theme.brandColor};
      font-weight: bold;
      padding-right: 4px;
      padding-left: 4px;
    }
  }
`;

const SettingBtnWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export default DeliverInfoPage;
