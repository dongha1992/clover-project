import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SVGIcon } from '@utils/common';
import Image from '@components/Shared/Image';

interface IProps {
  onChange?: (currentIndex: number) => void;
  initialSlide: number;
  images: string[];
}

const NextArrow = ({ onClick }: any) => {
  return (
    <NextArrowWrapper onClick={onClick}>
      <SVGIcon name="arrowRightBanner" />
    </NextArrowWrapper>
  );
};

const PreviousArrow = ({ onClick }: any) => {
  return (
    <PreviousArrowWrapper onClick={onClick}>
      <SVGIcon name="arrowLeftBanner" />
    </PreviousArrowWrapper>
  );
};

const ViewerCarousel = ({ images, initialSlide, onChange }: IProps) => {
  const [isArrowShow, setIsArrowShow] = useState<boolean>(false);

  const settings = {
    arrows: isArrowShow,
    dots: false,
    initialSlide,
    spped: 500,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: true,
    afterChange: onChange,
    centerPadding: '0px',
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
  };

  return (
    <Container
      onMouseEnter={() => {
        setIsArrowShow(true);
      }}
      onMouseLeave={() => {
        setIsArrowShow(false);
      }}
    >
      <Slider {...settings}>
        {images.map((url: string, index: number) => {
          return (
            <Image
              src={url}
              key={index}
              className={"review-image"}
              width="640"
              height="480"
              alt="리뷰이미지"
              layout={"responsive"}>
            </Image>
          );
        })}
      </Slider>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  max-width: ${breakpoints.mobile}px;
  min-width: ${breakpoints.sm}px;
  width: 100%;
  .slick-slider {
    width: 100%;

    .slick-list {
      padding: 0 !important;
      .slick-track {
        .slick-slide {
          font-size: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
    .slick-dots {
      display: flex !important;
      align-items: center;
      justify-content: center;
      li {
        border-radius: 3px;
        margin: 20px 10px 10px;
      }
    }
    .slick-dots li.slick-active {
      color: #767e90;
    }
  }
  .review-image {
    height:auto!important;
    min-height: 0!important;
  }
`;

const NextArrowWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000000;
`;

const PreviousArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 1000000;
`;

export default React.memo(ViewerCarousel);
