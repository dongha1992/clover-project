import React, { useMemo, useState } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  count?: number;
  rating: number;
  onRating?: (e: React.MouseEvent<HTMLDivElement>, idx: number) => void;
  hoverRating?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, idx: number) => void;
  width?: string;
  height?: string;
}

const StarRating = ({ count = 5, rating, hoverRating, onRating, onClick, width, height }: IProps) => {
  const getSvgName = (index: number) => {
    if (Math.ceil(rating) === index && rating % 1 !== 0) {
      return 'reviewStarHalf';
    } else if (hoverRating && hoverRating >= index) {
      return 'reviewStarFull';
    } else if (!hoverRating && rating >= index) {
      return 'reviewStarFull';
    } else {
      return 'reviewStarEmpty';
    }
  };

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <div
          key={idx}
          // onMouseOver={(e) => onRating && onRating(e, idx)}
          onClick={(e) => onClick && onClick(e, idx)}
          // onMouseLeave={(e) => onRating && onRating(e, idx)}
        >
          <div>
            <SVGIcon name={getSvgName(idx)} width={width} height={height} />
          </div>
        </div>
      ));
  }, [count, rating]);

  return <Container>{starRating}</Container>;
};

const Container = styled.div`
  display: flex;
  > div {
    padding-right: 8px;
  }
`;

export default StarRating;
