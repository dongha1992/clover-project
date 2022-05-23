import Badge from '@components/Item/Badge';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { FlexWrapWrapper, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import Image from 'next/image';
import router from 'next/router';
import styled from 'styled-components';

interface IProps {
  item: any;
  height?: string;
  width?: string;
  testType?: string;
}
const SubsItem = ({ item, height, width, testType }: IProps) => {
  const goToDetail = () => {
    router.push(`/subscription/products/135?subsDeliveryType=${testType}`);
  };

  return (
    <ItemBox onClick={goToDetail} width={width}>
      <ImageWrapper height={height}>
        <Image
          src="https://data.0app0.com/diet/shop/goods/20200221/20200221114721_3233114066_2.jpg"
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="rounded"
        />

        <BadgeArea className={true ? '' : 'pl'}>
          <Badge message={'BEST'} />
          <Label>단기구독전용</Label>
          <Label>단기구독전용</Label>
        </BadgeArea>
      </ImageWrapper>
      <TextBox>
        <TextH5B>900Kcal 집중관리</TextH5B>
        <TextB3R color={theme.greyScale65} padding="8px 0 4px">
          [주2회 배송] 부담없는 샐러드+간편식 식단
        </TextB3R>
        <FlexWrapWrapper>
          <TextH5B>72,000원 ~</TextH5B>
          <Like>
            <SVGIcon name="like" />
            <TextB3R padding="3px 0 0">10</TextB3R>
          </Like>
        </FlexWrapWrapper>
      </TextBox>
    </ItemBox>
  );
};
const ItemBox = styled.div<{ width: string | undefined }>`
  width: ${(props) => (props.width ? props.width : '100%')};
  margin-bottom: 24px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ImageWrapper = styled.div<{ height: string | undefined }>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.height ? props.height : '176px')};
  .rounded {
    border-radius: 8px;
  }
`;

const BadgeArea = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 10%;
  &.pl {
    padding-left: 16px;
  }
  > div {
    position: relative;
    margin-right: 8px;
  }
  span {
    margin-right: 4px;
  }
`;

const Label = styled.span`
  z-index: 1;
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background: rgba(36, 36, 36, 0.8);
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  color: #fff;
`;
const TextBox = styled.div`
  padding-top: 8px;
`;
const Like = styled.div`
  display: flex;
  align-items: center;
`;
export default SubsItem;
