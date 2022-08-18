import React from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Shared/Text';
import { useDispatch } from 'react-redux';
import { homePadding } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useToast } from '@hooks/useToast';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { copyToClipboard } from '@utils/common/clipboard';
import { SET_ALERT } from '@store/alert';

/* TODO : og 태그 고려 */

interface IParams {
  shareUrl: string;
}

const ShareSheet = ({ shareUrl }: IParams) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const windowOpen = (url: string) => {
    window.open(url, '', 'width=600,height=300,top=100,left=100,scrollbars=yes');
  };

  const handleKakaoTalk = () => {
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '',
        description: '',
        imageUrl: '',
        imageWidth: 800,
        imageHeight: 420,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
      buttons: [],
    });
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    windowOpen(url);
  }

  const handleBand = () => {
    const encodeUrl = encodeURIComponent(shareUrl);
    const encodeTitle = encodeURIComponent('1');

    const link = `https://band.us/plugin/share?body=${encodeTitle}&route=${encodeUrl}`;
    window.open(link, 'share', 'width=500, height=500');
  }

  const handleCopyUrl = async () => {
    try {
      await copyToClipboard(shareUrl);
      showToast({ message: '링크가 복사되었습니다.' });
      dispatch(INIT_BOTTOM_SHEET());
    } catch (e) {
      dispatch(
        SET_ALERT({
          alertMessage: '클립보드 복사에 살패 하였습니다.',
        })
      );
    }
  }

  return (
    <Container>
      <Wrapper>
        <TextH5B center padding="24px 0 16px 0">
          공유하기
        </TextH5B>
        <LinkWrapper>
          <LinkGroup onClick={handleKakaoTalk}>
            <SVGIcon name="kakao" />
            <TextH5B padding="0 0 0 8px">카카오톡</TextH5B>
          </LinkGroup>
          <LinkGroup onClick={handleFacebook}>
            <SVGIcon name="facebook" />
            <TextH5B padding="0 0 0 8px">페이스북</TextH5B>
          </LinkGroup>
          <LinkGroup onClick={handleBand}>
            <SVGIcon name="band" />
            <TextH5B padding="0 0 0 8px">밴드</TextH5B>
          </LinkGroup>
          <LinkGroup onClick={handleCopyUrl}>
            <SVGIcon name="urlIcon" />
            <TextH5B padding="0 0 0 8px">링크복사</TextH5B>
          </LinkGroup>
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
