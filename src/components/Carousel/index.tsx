import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';

const BANNERS = [
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
];

const settings = {
  arrows: false,
  dots: false,
  spped: 500,
  sliderToShow: 1,
  slidersToScroll: 1,
  centerMode: true,
  infinite: false,
  customPagimg: () => <div />,
  centerPadding: '20px',
};

function Carousel() {
  return (
    <Container>
      <Slider {...settings}>
        {BANNERS.map((image, index) => {
          return (
            <ImageWrapper
              src={image}
              alt="image"
              key={index}
              isLast={index === BANNERS.length + 1}
            />
          );
        })}
      </Slider>
    </Container>
  );
}

const Container = styled.div`
  max-width: ${breakpoints.mobile}px;
  min-width: ${breakpoints.sm}px;
  .slick-slider {
    .slick-list {
      padding: 0 !important;
      .slick-track {
        .slick-slide {
        }
      }
    }
    .slick-dots {
      display: flex !important;
      align-items: center;
      justify-content: center;
      li {
        /* width: 6px;
        height: 6px; */
        border-radius: 3px;
        /* background-color: #cbced3; */
        margin: 20px 10px 10px;
      }
    }
    .slick-dots li.slick-active {
      color: #767e90;
    }
  }
`;

const ImageWrapper = styled.img<{ isLast: boolean }>`
  width: 100%;
  height: 378px;
  object-fit: cover;
  /* padding-right: ${(props) => (props.isLast ? '0px' : '8px')}; */
`;

export default Carousel;