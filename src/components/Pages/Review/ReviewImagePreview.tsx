import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import Image from '@components/Shared/Image';
import { theme } from '@styles/theme';

interface IReviewImagePreviewProps {
  image: string
  onRemove(image:string): void
}

export const ReviewImagePreview = ({ image, onRemove }: IReviewImagePreviewProps) => {
  return (
    <PreviewImgWrapper>
      <Image src={image} width="72" height="72" alt="메뉴 후기"></Image>
      <div className="svgWrapper" onClick={() => onRemove(image)}>
        <SVGIcon name="blackBackgroundCancel" />
      </div>
    </PreviewImgWrapper>
  )
}

const PreviewImgWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  background-color: ${theme.greyScale6};
  border-radius: 8px;
  margin: 16px 0 48px 8px;
  border: none;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .svgWrapper {
    svg {
      cursor: pointer;
      position: absolute;
      right: 10%;
      top: 10%;
    }
  }
`;