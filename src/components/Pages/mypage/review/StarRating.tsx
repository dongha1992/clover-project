import SVGIcon from '@utils/SVGIcon';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const pointNumber = 4;

function StarRating() {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);

  const onMouseEnter = (index: number) => {
    console.log(index);
    setHoverRating(index);
  };
  // // 마우스가 별 위에 올라가면 스테이트를 변경.
  // const onMouseLeave = () => setHoverRating(0);
  // // 마우스가 별 밖으로 나가면 스테이트를 0으로 변경.
  // const onSaveRating = (index: number) => setRating(index);
  // // 클릭시, 별 인덱스를 스테이트에 저장.

  return (
    <Container>
      <Rating>
        {new Array(5).fill(1).map((star, index) => {
          console.log(hoverRating - index > 0.5);
          const isFull = hoverRating - index > 0.5;
          const isHalf = hoverRating - index > 0 && hoverRating - index < 0.5;

          if (isFull) {
            return (
              <div onMouseEnter={() => onMouseEnter(index + 1)} key={index}>
                <SVGIcon name="reviewStarFull" />
              </div>
            );
          } else if (isHalf) {
            return (
              <div onMouseEnter={() => onMouseEnter(index + 1)} key={index}>
                <SVGIcon name="reviewStarHalf" />
              </div>
            );
          } else {
            return (
              <div onMouseEnter={() => onMouseEnter(index + 1)} key={index}>
                <SVGIcon name="reviewStarEmpty" />
              </div>
            );
          }
        })}
      </Rating>
    </Container>
  );
}

{
  /* <svg
  width="32"
  height="31"
  viewBox="0 0 32 31"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M15.1252 0.579177C15.5059 -0.108073 16.494 -0.108071 16.8747 0.579178L21.222 8.42703C21.3599 8.67595 21.5973 8.85434 21.8747 8.91751L30.3922 10.8569C31.1242 11.0235 31.4184 11.9074 30.9322 12.4795L25.0739 19.3733C24.8988 19.5793 24.8146 19.8475 24.8405 20.1167L25.7213 29.2633C25.7953 30.0324 25.0065 30.5913 24.3055 30.2665L16.4204 26.613C16.1537 26.4895 15.8462 26.4895 15.5796 26.613L7.69447 30.2665C6.99346 30.5913 6.20461 30.0324 6.27866 29.2633L7.15943 20.1167C7.18535 19.8475 7.10115 19.5793 6.92605 19.3733L1.06775 12.4795C0.581592 11.9074 0.875735 11.0235 1.60776 10.8569L10.1252 8.91751C10.4027 8.85434 10.6401 8.67595 10.778 8.42703L15.1252 0.579177Z"
    fill="#F4D740"
  />
</svg>; */
}

// <svg
//   width="32"
//   height="31"
//   viewBox="0 0 32 31"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <path
//     d="M15.1252 0.579177C15.5059 -0.108073 16.494 -0.108071 16.8747 0.579178L21.222 8.42703C21.3599 8.67595 21.5973 8.85434 21.8747 8.91751L30.3922 10.8569C31.1242 11.0235 31.4184 11.9074 30.9322 12.4795L25.0739 19.3733C24.8988 19.5793 24.8146 19.8475 24.8405 20.1167L25.7213 29.2633C25.7953 30.0324 25.0065 30.5913 24.3055 30.2665L16.4204 26.613C16.1537 26.4895 15.8462 26.4895 15.5796 26.613L7.69447 30.2665C6.99346 30.5913 6.20461 30.0324 6.27866 29.2633L7.15943 20.1167C7.18535 19.8475 7.10115 19.5793 6.92605 19.3733L1.06775 12.4795C0.581592 11.9074 0.875735 11.0235 1.60776 10.8569L10.1252 8.91751C10.4027 8.85434 10.6401 8.67595 10.778 8.42703L15.1252 0.579177Z"
//     fill="#F2F2F2"
//   />
// </svg>;

{
  /* <svg
  width="32"
  height="31"
  viewBox="0 0 32 31"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M15.1252 0.579177C15.5059 -0.108073 16.494 -0.108071 16.8747 0.579178L21.222 8.42703C21.3599 8.67595 21.5973 8.85434 21.8747 8.91751L30.3922 10.8569C31.1242 11.0235 31.4184 11.9074 30.9322 12.4795L25.0739 19.3733C24.8988 19.5793 24.8146 19.8475 24.8405 20.1167L25.7213 29.2633C25.7953 30.0324 25.0065 30.5913 24.3055 30.2665L16.4204 26.613C16.1537 26.4895 15.8462 26.4895 15.5796 26.613L7.69447 30.2665C6.99346 30.5913 6.20461 30.0324 6.27866 29.2633L7.15943 20.1167C7.18535 19.8475 7.10115 19.5793 6.92605 19.3733L1.06775 12.4795C0.581592 11.9074 0.875735 11.0235 1.60776 10.8569L10.1252 8.91751C10.4027 8.85434 10.6401 8.67595 10.778 8.42703L15.1252 0.579177Z"
    fill="#F2F2F2"
  />
</svg>; */
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  svg.outlined {
    path {
      fill: #ccc;
    }
  }
  svg.filled {
    path {
      fill: #2ac1bc;
    }
  }
`;

export default StarRating;
