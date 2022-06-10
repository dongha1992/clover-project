import { Obj } from '@model/index';

export const MENU_DETAIL_INFORMATION = [
  {
    text: '상품 정보',
    link: '/menu/detail/product',
    value: 'product',
  },
  {
    text: '영양 정보',
    link: '/menu/detail/nutrition',
    value: 'nutrition',
  },
  {
    text: '배송 정보',
    link: '/menu/detail/delivery',
    value: 'delivery',
  },
];

export const MENU_REVIEW_AND_FAQ = [
  {
    text: '상세 정보',
    link: '/menu/[id]',
    value: 'info',
  },
  {
    text: '후기',
    link: '/menu/detail/review',
    value: 'review',
  },
  {
    text: 'FAQ',
    link: '/menu/detail/faq',
    value: 'faq',
  },
];

export const COUPON_LIST = [
  {
    id: 1,
    discount: 20,
    name: '따끈따끈 15% 할인 쿠폰',
    canUseMenu: ['[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트'],
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
    deliveryMethod: '전체',
  },
  {
    id: 2,
    discount: 2000,
    name: '2,000원 할인 쿠폰',
    canUseMenu: ['[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트'],
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'fixed',
    isDownload: true,
    deliveryMethod: '새벽배송 / 정기구독',
  },
  {
    id: 3,
    discount: 10,
    name: '10% 할인',
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
    canUseMenu: ['[도레도레] 마들렌 세트'],
  },
];

export const COMPLETE = {
  data: {
    code: 200,
    message: 'OK',
    data: [
      {
        id: 36,
        userNickName: '마천동킹크랩',
        menuId: 1,
        menuName: '[EWHA] 소프트 두부 샐러드',
        menuDetailName: '레귤러',
        rating: 0,
        content: '텟11',
        createdAt: '2022-03-21',
        images: [],
      },
      {
        id: 25,
        userNickName: '마천동킹크랩',
        menuId: 2,
        menuName: '[EWHA] 쉬파 샐러드',
        menuDetailName: '1번의 디테일네임',
        rating: 4,
        content: '88888888888너무 맛있어서 감동이에요!',
        commenter: '마천동킹크랩',
        commentCreatedAt: '2022-03-17',
        createdAt: '2022-02-22',
        images: [
          {
            id: 23,
            menuReviewId: 25,
            url: 'url',
            width: 55,
            height: 100,
            size: 55,
          },
        ],
      },
      {
        id: 16,
        userNickName: '마천동킹크랩',
        menuId: 1,
        menuName: '[EWHA] 소프트 두부 샐러드',
        menuDetailName: '1번의 디테일네임',
        rating: 4.5,
        content: '세상에서 가장 맛 있는',
        createdAt: '2022-02-22',
        images: [],
      },
      {
        id: 7,
        userNickName: '마천동킹크랩',
        menuId: 1,
        menuName: '[EWHA] 소프트 두부 샐러드',
        menuDetailName: '1번의 디테일네임',
        rating: 3.5,
        content: '수정해용',
        commenter: 'admin kay',
        commentCreatedAt: '2022-03-16',
        createdAt: '2022-02-17',
        images: [
          {
            id: 4,
            menuReviewId: 7,
            url: 'url',
            width: 0,
            height: 0,
            size: 0,
          },
          {
            id: 5,
            menuReviewId: 7,
            url: 'url',
            width: 0,
            height: 0,
            size: 0,
          },
        ],
      },
    ],
  },
};

export const DETAIL = {
  data: {
    code: 200,
    message: 'OK',
    data: {
      searchReview: {
        id: 1,
        userNickName: 'u***1',
        menuName: '[EWHA] 소프트 두부 샐러드',
        menuDetailName: '1번의 디테일네임',
        orderCount: 1,
        rating: 4.5,
        content: '너무 맛있어서 감동이에요!',
        comment: '안녕하세요. 프레시코드입니다 (୨୧ ❛ᴗ❛)✧ 소중한 시간에 이렇게 후기까지 남겨 주셔서 정말 감사합니다1',
        commenter: '마천동킹크랩',
        commentCreatedAt: '2022-03-17',
        createdAt: '2022-02-08',
        reviewImages: [
          {
            id: 3587,
            url: 'url',
            width: 0,
            height: 0,
          },
        ],
      },
      menuImage: {
        id: 2526,
        url: 'test/test/test',
        width: 288,
        height: 255,
      },
    },
  },
};

export const ALL_REVIEW = {
  data: {
    code: 200,
    message: 'OK',
    data: {
      searchReviews: [
        {
          id: 36,
          userNickName: '마****랩',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '레귤러',
          orderCount: 0,
          rating: 0,
          content: '텟11',
          createdAt: '2022-03-21',
          images: [],
        },
        {
          id: 33,
          userNickName: 'u***3',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '레귤러',
          orderCount: 1,
          rating: 0,
          content: '삼십삼번의 리뷰',
          comment: '감사해요 !! 나이스ㅇ',
          commenter: '마천동킹크랩',
          commentCreatedAt: '2022-03-16',
          createdAt: '2022-03-16',
          images: [],
        },
        {
          id: 32,
          userNickName: 's****g',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '1번의 디테일네임',
          orderCount: 3,
          rating: 4.5,
          content: '너무 맛있어서 감동이에요!',
          createdAt: '2022-03-08',
          images: [
            {
              id: 3586,
              url: 'url',
              width: 0,
              height: 0,
            },
          ],
        },
        {
          id: 29,
          userNickName: 's****g',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '1번의 디테일네임',
          orderCount: 3,
          rating: 4.5,
          content: '너무 맛있어서 감동이에요!',
          createdAt: '2022-02-24',
          images: [
            {
              id: 3579,
              url: 'url',
              width: 0,
              height: 0,
            },
          ],
        },
        {
          id: 16,
          userNickName: '마****랩',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '1번의 디테일네임',
          orderCount: 1,
          rating: 4.5,
          content: '세상에서 가장 맛 있는',
          createdAt: '2022-02-22',
          images: [],
        },
        {
          id: 7,
          userNickName: '마****랩',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '1번의 디테일네임',
          orderCount: 4,
          rating: 3.5,
          content: '수정해용',
          comment: '관리자 댓글 7',
          commenter: 'admin kay',
          commentCreatedAt: '2022-03-16',
          createdAt: '2022-02-17',
          images: [
            {
              id: 3550,
              url: 'url',
              width: 0,
              height: 0,
            },
            {
              id: 3551,
              url: 'url',
              width: 0,
              height: 0,
            },
          ],
        },
        {
          id: 3,
          userNickName: 'u***3',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '3번의 디테일네임',
          orderCount: 3,
          rating: 2,
          content: 'good3',
          comment: '관리자 댓글 3',
          commenter: 'admin kay',
          commentCreatedAt: '2022-03-16',
          createdAt: '2022-02-10',
          images: [],
        },
        {
          id: 2,
          userNickName: 'u***2',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '2번의 디테일네임',
          orderCount: 2,
          rating: 3.5,
          content: 'good2',
          comment: '관리자 댓글 2',
          commenter: 'admin kay',
          commentCreatedAt: '2022-03-16',
          createdAt: '2022-02-09',
          images: [],
        },
        {
          id: 1,
          userNickName: 'u***1',
          menuName: '[EWHA] 소프트 두부 샐러드',
          menuDetailName: '1번의 디테일네임',
          orderCount: 1,
          rating: 4.5,
          content: '너무 맛있어서 감동이에요!',
          comment: '안녕하세요. 프레시코드입니다 (୨୧ ❛ᴗ❛)✧ 소중한 시간에 이렇게 후기까지 남겨 주셔서 정말 감사합니다1',
          commenter: '마천동킹크랩',
          commentCreatedAt: '2022-03-17',
          createdAt: '2022-02-08',
          images: [
            {
              id: 3587,
              url: 'url',
              width: 0,
              height: 0,
            },
          ],
        },
      ],
      searchReviewImages: [
        {
          id: 40,
          menuReviewId: 1,
          url: 'url',
          width: 0,
          height: 0,
          size: 0,
        },
        {
          id: 39,
          menuReviewId: 32,
          url: 'url',
          width: 0,
          height: 0,
          size: 0,
        },
        {
          id: 32,
          menuReviewId: 29,
          url: 'url',
          width: 0,
          height: 0,
          size: 0,
        },
        {
          id: 5,
          menuReviewId: 7,
          url: 'url',
          width: 0,
          height: 0,
          size: 0,
        },
        {
          id: 4,
          menuReviewId: 7,
          url: 'url',
          width: 0,
          height: 0,
          size: 0,
        },
      ],
    },
  },
};

export const WILL_WRITE = {
  data: {
    code: 200,
    message: 'OK',
    data: [
      {
        orderDeliveryId: 270453,
        deliveryDate: '2022-03-16',
        delivery: 'MORNING',
        orderMenus: [
          {
            menuId: 11,
            menuDetailId: 131,
            menuName: '핫픽 샐러드',
            menuDetailName: '미디움 (M)',
            main: true,
            image: {
              id: 2536,
              url: '/menu/origin/11_20211221111256',
              width: 564,
              height: 564,
            },
          },
          {
            menuId: 156,
            menuDetailId: 491,
            menuName: '구운 버섯 두부 샐러드',
            menuDetailName: '미디움 (M)',
            main: false,
            image: {
              id: 2680,
              url: '/menu/origin/156_20211015182233',
              width: 600,
              height: 600,
            },
          },
        ],
      },
    ],
  },
};

export const CATEGORY_TITLE_MAP: Obj = {
  all: '전체메뉴',
  salad: '샐러드',
  wrap: '랩·샌드위치',
  meal: '도시락·간편식',
  package: '세트상품',
  snack: '간식',
  soup: '죽·스프',
  drink: '음료',
};
