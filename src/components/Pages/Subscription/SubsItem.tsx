import Badge from '@components/Item/Badge';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { FlexWrapWrapper, theme } from '@styles/theme';
import { getFormatPrice, SVGIcon } from '@utils/common';
import { getMenuDisplayPrice } from '@utils/menu';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Label } from './SubsCardItem';

interface IProps {
  item: any;
  height?: string;
  width?: string;
  testType?: string;
}
const SubsItem = ({ item, height, width, testType }: IProps) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const {
    id,
    menuDetails,
    badgeMessage,
    name,
    description,
    liked,
    likeCount,
    subscriptionPeriods,
    subscriptionDeliveries,
  } = item;

  const { discountedPrice } = getMenuDisplayPrice(menuDetails ?? [{}]);

  useEffect(() => {
    // TODO(young): 단기구독전용, 쿠폰 등이 태그로 들어가는데 현재 쿠폰태그가 추가될지 모르는 상황 추후 배열로 처리할지 string으로 처리할지 수정필요

    if (!subscriptionPeriods?.includes('UNLIMITED') && !tagList?.includes('단기구독전용')) {
      setTagList([...tagList, '단기구독전용']);
    }
  }, [subscriptionPeriods, tagList]);

  const goToDetail = () => {
    router.push(`/menu/${id}`);
    // router.push(`/subscription/products/${id}?subsDeliveryType=${subscriptionDeliveries[0]}`);
  };
  return (
    <ItemBox onClick={goToDetail} width={width}>
      <ImageWrapper height={height}>
        <Image
          src={IMAGE_S3_URL + item.thumbnail[0].url}
          alt="상품이미지"
          width={'100%'}
          height={'100%'}
          layout="responsive"
        />

        <LabelArea>
          {badgeMessage && <Badge message={badgeMessage} />}

          <TagBox className={`${badgeMessage ? 'marginL8' : 'marginL16'}`}>
            {subscriptionDeliveries?.map((item: string, index: number) => (
              <Label className={item} key={index}>
                {DELIVERY_TYPE_MAP[item]}
              </Label>
            ))}
            {tagList && tagList?.map((tag: string, index: number) => <Tag key={index}>{tag}</Tag>)}
          </TagBox>
        </LabelArea>
      </ImageWrapper>
      <TextBox>
        <TextH5B>{name?.trim()}</TextH5B>
        <TextB3R color={theme.greyScale65} margin="8px 0 4px" className="description">
          {description?.trim()}
        </TextB3R>
        <FlexWrapWrapper>
          <TextH5B>{getFormatPrice(String(discountedPrice))}원 ~</TextH5B>
          <Like>
            <SVGIcon name={`${liked ? 'likeRed18' : 'likeBorderGray'}`} />
            <TextB3R padding="3px 0 0 2px">{likeCount}</TextB3R>
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
  max-height: 261px;
  border-radius: 8px;
  overflow: hidden;
`;

const LabelArea = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 16px;
  > div {
    position: relative;
  }
  span {
    margin-right: 4px;
  }
`;

const TagBox = styled.div`
  display: flex;
  &.marginL8 {
    margin-left: 8px;
  }
  &.marginL16 {
    margin-left: 16px;
  }
`;

const Tag = styled.span`
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
  .description {
    height: 18px;
    line-height: 18px;
    overflow: hidden;
  }
`;
const Like = styled.div`
  display: flex;
  align-items: center;
`;
export default SubsItem;
