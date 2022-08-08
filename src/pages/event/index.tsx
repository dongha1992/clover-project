import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from '@components/Shared/Image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { SET_EVENT_TITLE, INIT_EVENT_TITLE } from '@store/event';

const EVENT_BANNER = [
  {
    id: 1,
    title: '기획전 김치전 해물파전은 맛있어',
    promotion: true,
    img: '/banner/img_home_contents_event.png', 
    edit: true,
  },
  {
    id: 2,
    title: '이건 무슨 기획전일까?',
    promotion: true,
    img: '/banner/img_home_contents_event_2.png', 
    edit: false,
  },
  {
    id: 3,
    title: '',
    promotion: false,
    img: '/banner/img_home_contents_event.png', 
    edit: false,
  },
  {
    id: 4,
    title: '',
    promotion: false,
    img: '/banner/img_home_contents_event_2.png', 
    edit: false,
  },
  {
    id: 5,
    title: '',
    promotion: false,
    img: '/banner/img_home_contents_event.png', 
    edit: false,
  },
  {
    id: 6,
    title: '',
    promotion: false,
    img: '/banner/img_home_contents_event_2.png', 
    edit: false,
  },
];

const EventPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);

  const goToEvent = (promotion: boolean, id: number, edit: boolean, title: string) => {
    if(promotion) {
      dispatch(SET_EVENT_TITLE(title));
      router.push({
        pathname: '/promotion/detail',
        query: {
          id: id,
          edit_feed: edit,
        },
      });
    } else {
      router.push('/event');
    };
  };
  return (
    <Container>
      {
        EVENT_BANNER.map((item, idx)=> {
          return (
            <BannerWrapper key={idx} onClick={() => goToEvent(item.promotion, item.id, item.edit, item.title)}>
              <Image
                src={item.img}
                height="300px"
                width="512px"
                layout="responsive"
                alt="기획전"
              />
            </BannerWrapper>
          )
        })
      
      }
    </Container>
  )
};

const Container = styled.div`
  width: 100%;
`;

const BannerWrapper = styled.div`
  width: 100%;
`;

export default EventPage;
