import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from '@components/Shared/Image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { useQuery } from 'react-query';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';

const EventPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [eventbannerList, setEventBannerList] = useState<IBanners[]>([]);

  const { error: eventsError } = useQuery(
    'eventsBanners',
    async () => {
      const params = { type: 'EVENT', size: 100 };
      const { data } = await getBannersApi(params);
      setEventBannerList(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const goToEvent = (id: number, title: string) => {
    // if(promotion) {
    //   dispatch(SET_EVENT_TITLE(title));
    //   router.push({
    //     pathname: '/promotion/detail',
    //     query: {
    //       id: id,
    //       edit_feed: edit,
    //     },
    //   });
    // } else {
      router.push('/event');
    // };
  };
  return (
    <Container>
      {
        eventbannerList.length > 0 ? (
          eventbannerList.map((item, idx)=> {
            return (
              <BannerWrapper key={idx} onClick={() => goToEvent(item.id, item.title)}>
                <Image
                  src={item?.image?.url}
                  height="300px"
                  width="512px"
                  layout="responsive"
                  alt="기획전"
                />
              </BannerWrapper>
            )
          })
        ) : (
          <NoneEventList>
            <TextB3R color={theme.greyScale65}>이벤트·소식이 없어요. 😭</TextB3R>
          </NoneEventList>
        )
      }
    </Container>
  )
};

const Container = styled.div`
  width: 100%;
`;

const BannerWrapper = styled.div`
  width: 100%;
  cursor: pointer;
`;

const NoneEventList = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default EventPage;
