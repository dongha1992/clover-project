import styled, { keyframes } from 'styled-components';

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const Skeleton = styled.div<{ height?: string; width?: string; margin?: string; borderRadius?: string }>`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  animation: ${skeletonKeyframes} 1500ms ease-in-out infinite;
  background-color: #f2f2f2;
  background-image: linear-gradient(90deg, #f2f2f2, #f7f7f7, #f2f2f2);
  background-size: 200px 100%;
  background-repeat: no-repeat;
  margin: ${(props) => props.margin};
  border-radius: ${(props) => props.borderRadius};
`;

export const ItemList = styled.div`
  padding-left: 24px;
  padding-bottom: 48px;
  width: 1000px;
  overflow: hidden;
`;

export const ItemBox = styled.div`
  float: left;
  margin-right: 16px;
`;
