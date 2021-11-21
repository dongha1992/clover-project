import React, { useState } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB2R } from '@components/Text';
import { Select, Option } from '@components/Dropdown';
import { theme } from '@styles/theme';
import BorderLine from '@components/BorderLine';

const MAIN_OPTIONS = [
  { id: 1, text: '닭가슴살 아몬드 샐러드 (M)', price: 10000, type: 'main' },
  { id: 2, text: '닭가슴살 아몬드 샐러드 (L)', price: 5000, type: 'main' },
  { id: 3, text: '닭가슴살 아몬드 샐러드 (L)', price: 100000, type: 'main' },
];
const SECONDRY_OPTIONS = [
  {
    id: 3,
    text: '[프코메이드] 하루과일 스테비아 방울토마토',
    price: 1000,
    type: 'optional',
  },
  {
    id: 4,
    text: '[프코메이드] 하루과일 파인애플',
    price: 200,
    type: 'optional',
  },
];

function CartModalGroup({ item }: any) {
  const [selectedMenus, setSelectedMenus] = useState({});

  const selectMenuHandler = (menu: any) => {
    setSelectedMenus({ ...selectedMenus, [menu.type]: menu });
  };

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        옵션 선택
      </TextH5B>
      <Wrapper>
        <Main>
          <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
            필수옵션
          </TextH5B>
          <Select
            placeholder="필수옵션"
            type={'main'}
            selectedMenus={selectedMenus}
          >
            {MAIN_OPTIONS.map((option, index) => (
              <Option
                key={index}
                option={option}
                selectMenuHandler={selectMenuHandler}
              />
            ))}
          </Select>
        </Main>
        <Optional>
          {SECONDRY_OPTIONS.length ? (
            <>
              <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
                선택옵션
              </TextH5B>
              <Select
                placeholder="선택옵션"
                type={'optional'}
                selectedMenus={selectedMenus}
              >
                {SECONDRY_OPTIONS.map((option, index) => (
                  <Option
                    key={index}
                    option={option}
                    selectMenuHandler={selectMenuHandler}
                  />
                ))}
              </Select>
            </>
          ) : null}
        </Optional>
        <TotalSumContainer>
          <TextH5B>총 개</TextH5B>
          <TextH5B>0원</TextH5B>
        </TotalSumContainer>
        <BorderLine height={1} margin="13px 0 10px 0" />
        <DeliveryInforContainer>
          <TextB2R display="flex">
            13:40 내 주문하면 내일
            <TextH5B padding="0px 4px">새벽 7시 전</TextH5B>도착
          </TextB2R>
        </DeliveryInforContainer>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 0 24px;
  width: 100%;
`;

const Main = styled.div`
  width: 100%;
`;
const Optional = styled.div`
  width: 100%;
`;

const TotalSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeliveryInforContainer = styled.div`
  display: flex;
`;

export default React.memo(CartModalGroup);
