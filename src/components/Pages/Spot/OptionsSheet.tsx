import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { homePadding } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';
import { RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';

const TIME = [
  { id: 1, name: '11:00' },
  { id: 2, name: '11:30' },
  { id: 3, name: '12:00' },
  { id: 4, name: '12:30' },
  { id: 5, name: '13:00' },
  { id: 6, name: '기타' },
];

const PRIVATE_PLACE = [
  { id: 1, name: '회사' },
  { id: 2, name: '학교' },
  { id: 3, name: '공유오피스' },
  { id: 4, name: '기타' },
];

const PICKUP = [
  { id: 1, name: '공용 냉장고' },
  { id: 2, name: '문서 수발실' },
  { id: 3, name: '택배 보관함' },
  { id: 4, name: '안내 데스크' },
  { id: 5, name: '공용 테이블' },
  { id: 6, name: '사무실 문 앞' },
  { id: 7, name: '기타' },
];

const PUBLIC_PLACE = [
  { id: 1, name: '편의점' },
  { id: 2, name: '일반상점' },
  { id: 3, name: '피트니스' },
  { id: 4, name: '서점' },
  { id: 5, name: '약국' },
  { id: 6, name: '카페' },
  { id: 7, name: '기타' },
];

interface IProps {
  tab?: string;
}

const OptionsSheet = ({ tab }: IProps): ReactElement => {
  const [selectedPickupPlace, setSelectedPickupPlace] = useState<number>(1);
  const changeRadioHandler = (id: number) => {
    setSelectedPickupPlace(id);
  };
  const router = useRouter();
  const { type } = router.query;

  const selectTab = () => {
    if (tab === 'pickUp') {
      return PICKUP;
    } else if (tab === 'time') {
      return TIME;
    } else if (tab === 'place' && type === 'private') {
      return PRIVATE_PLACE;
    } else if (tab === 'place') {
      return PUBLIC_PLACE;
    }
  };
  // const seletedTime = PICK_UP_PLACE.find((item)=> item.id === Number(selectedPickupPlace))?.name;

  return (
    <Container>
      <Wrapper>
        <TextH5B padding="24px 0 16px 0" center>
          {tab === 'place'
            ? '장소 종류'
            : tab === 'time'
            ? '점심 시간'
            : '픽업장소'}
        </TextH5B>
        <SelectWrapper>
          {selectTab()?.map((item) => {
            return (
              <Selected key={item.id}>
                <RadioButton
                  onChange={() => changeRadioHandler(item.id)}
                  isSelected={selectedPickupPlace === item.id}
                />
                <TextH5B padding="0 0 0 8px">{item.name}</TextH5B>
              </Selected>
            );
          })}
        </SelectWrapper>
      </Wrapper>
    </Container>
  );
};
const Container = styled.main``;

const Wrapper = styled.div`
  ${homePadding}
`;

const SelectWrapper = styled.section`
  display: grid;
  grid-template-columns: 150px 150px;
  justify-content: space-around;
`;

const Selected = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export default OptionsSheet;
