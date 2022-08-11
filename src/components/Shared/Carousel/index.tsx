import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SVGIcon } from '@utils/common';
import Image from '@components//Shared/Image';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';

export interface ICarouselImageProps {
  src: string;
  alt?: string;
  width?: number;
}

interface ICarouselProps {
  images: ICarouselImageProps[] | undefined;
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

const Carousel = ({ images }: ICarouselProps) => {
  const [isArrowShow, setIsArrowShow] = useState<boolean>(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  const settings = {
    arrows: isArrowShow,
    dots: false,
    spped: 500,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: true,
    afterChange: setCurrentPageNumber,
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
        {images?.map((image: ICarouselImageProps, index: number) => {
          return (
            <Image src={image.src} alt={image.alt || ''} width="512px" height="512px" layout="responsive" key={index} />
          );
        })}
      </Slider>
      <Count>
        <TextH6B color={theme.white}>{currentPageNumber + 1}</TextH6B>
        <TextH6B color={theme.white} padding="0 4px">
          /
        </TextH6B>
        <TextH6B color={theme.white}>{images?.length}</TextH6B>
      </Count>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  max-width: ${breakpoints.mobile}px;
  min-width: ${breakpoints.sm}px;
  .slick-slider {
    .slick-list {
      padding: 0 !important;
      .slick-track {
        .slick-slide {
          font-size: 0;
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
`;

const NextArrowWrapper = styled.div`
  position: absolute;
  right: 0%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const PreviousArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 46px;
  background: rgba(36, 36, 36, 0.5);
  right: 5%;
  bottom: 5%;
  padding: 4px 8px 2px;
  border-radius: 24px;
`;

export default React.memo(Carousel);
