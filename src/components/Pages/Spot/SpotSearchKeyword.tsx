import React from 'react';
import styled from 'styled-components';
import { TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface IProps {
    onChange: any
}

const SEARCH_KEYWORD = [
  {
    keyword: '#GS25',
    value: 'GS25',
  },
  {
    keyword: '#세븐일레븐',
    value: '세븐일레븐',
  },
  {
    keyword: '#스토리웨이',
    value: '스토리웨이',
  },
  {
    keyword: '#카페',
    value: '카페',
  },
];
  
const SpotSearchKeyword = ({onChange}: IProps) => {
  return (
    <Slider className="swiper-container" slidesPerView={'auto'} spaceBetween={10} speed={500}>
      <KeyWorkdWrapper>
        {
          SEARCH_KEYWORD.map((i, idx) => {
            return (
            <SwiperSlide className="swiper-slide" key={idx}>
              <KeyWord onClick={()=> onChange(i?.value)}>
                <TextB2R padding='8p 16px 8px 16px' color={theme.black}>{i.keyword}</TextB2R>
              </KeyWord>
            </SwiperSlide>
            )
          })
        }
      </KeyWorkdWrapper>
    </Slider>
  );
};

const KeyWorkdWrapper = styled.section`
  display: flex;
`;

const KeyWord = styled.div`
  background: ${theme.greyScale3};
  border-radius: 100px;
  padding: 8px 16px;
  overflow: auto; 
  white-space: nowrap;
  cursor: pointer;
`;

const Slider= styled(Swiper)`
  width: auto;
  padding-right: 24px;
  .swiper-slide {
    width: auto;
  }
`;

export default SpotSearchKeyword;
