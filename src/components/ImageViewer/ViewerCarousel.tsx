import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { breakpoints } from '@utils/common/getMediaQuery';
import { IBanners } from '@model/index';
import { IMAGE_S3_URL } from '@constants/mock';
import { SVGIcon } from '@utils/common';

interface IProps {
  setCountIndex?: React.Dispatch<React.SetStateAction<number>>;
  // images: IBanners[];
  images: any[] | any;
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

const ViewerCarousel = ({ images, setCountIndex }: IProps) => {
  const [isArrowShow, setIsArrowShow] = useState<boolean>(false);

  const settings = {
    arrows: isArrowShow ? true : false,
    dots: false,
    spped: 500,
    sliderToShow: 1,
    slidersToScroll: 1,
    centerMode: true,
    infinite: true,
    customPaging: () => <div />,
    afterChange: (current: number) => setCountIndex && setCountIndex(current),
    centerPadding: '0px',
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
  };
  console.log(images);
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
        {images?.map((url: string, index: number) => {
          return (
            <ImageWrapper
              src={`${IMAGE_S3_URL}${url}`}
              alt="리뷰이미지"
              key={index}
              isLast={index === images.length + 1}
            />
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

const ImageWrapper = styled.img<{ isLast: boolean }>`
  width: 100%;
  /* height: 100%; */
  /* object-fit: cover; */
  /* padding-right: ${(props) => (props.isLast ? '0px' : '8px')}; */
`;
const NextArrowWrapper = styled.div`
  position: absolute;
  right: 0%;
  top: 50%;
`;

const PreviousArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0%;
  z-index: 10;
`;

export default React.memo(ViewerCarousel);
