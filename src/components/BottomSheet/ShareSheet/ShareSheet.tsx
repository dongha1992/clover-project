import React from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Shared/Text';
import ShareSheetItem from './SheetSheetItem';
import { useSelector } from 'react-redux';
import { menuSelector } from '@store/menu';
import { homePadding } from '@styles/theme';
import { SVGIcon, getUrlLink } from '@utils/common';

/* TODO : og 태그 고려 */

const SHARE_ICONS = [
  { value: 'kakao', name: '카카오톡' },
  { value: 'facebook', name: '페이스북' },
  { value: 'band', name: '밴드' },
  { value: 'urlIcon', name: '링크 복사' },
];

const ShareSheet = () => {
  const { menuItem } = useSelector(menuSelector);

  const shareHandler = (e: React.MouseEvent<HTMLDivElement>, value: string) => {
    let url = window.location.href;
    const shareMapper: { [index: string]: () => void } = {
      kakao: () => {
        handleKakaoTalk();
      },
      facebook: () => {
        url = `http://www.facebook.com/sharer/sharer.php?u=${url}`;
        windowOpen(url);
      },
      band: () => {},
      urlIcon: () => {
        getUrlLink(e);
      },
    };

    shareMapper[value]();
  };

  const windowOpen = (url: string) => {
    window.open(url, '', 'width=600,height=300,top=100,left=100,scrollbars=yes');
  };

  const handleKakaoTalk = () => {
    const url = location.href;

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '',
        description: '',
        imageUrl: '',
        imageWidth: 800,
        imageHeight: 420,
        link: {
          webUrl: '',
          mobileWebUrl: '',
        },
      },
      buttons: [
        {
          title: '결과 보기',
          link: {
            webUrl: '',
            mobileWebUrl: '',
          },
        },
        {
          title: '테스트하기',
          link: {
            webUrl: '',
            mobileWebUrl: '',
          },
        },
      ],
    });
  };

  return (
    <Container>
      <Wrapper>
        <TextH5B center padding="24px 0 16px 0">
          공유하기
        </TextH5B>
        <ShareSheetItem menu={menuItem} />
        <LinkWrapper>
          {SHARE_ICONS.map((item, index) => (
            <LinkGroup key={index} onClick={(e) => shareHandler(e, item.value)}>
              <SVGIcon name={item.value} />
              <TextH5B padding="0 0 0 8px">{item.name}</TextH5B>
            </LinkGroup>
          ))}
        </LinkWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LinkWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 8px;
`;

const LinkGroup = styled.div`
  display: flex;
  padding: 13px 0;
  margin-right: 16px;
  cursor: pointer;
`;

export default ShareSheet;
