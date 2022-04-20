import { TLocationType } from '@utils/checkDestinationHelper';

export type Obj<T = any> = {
  [k: string]: T;
};

export declare type Cookie = any;

export interface CookieSetOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
}

export interface ISetCookie {
  name: string;
  value: string;
  option?: CookieSetOptions;
}

export interface IGetCookie {
  name: string;
}

export interface IRemoveCookie {
  name: string;
}

export interface ILayoutChildren {
  children: any;
}
/*TODO: params type 정의 다시  */

export interface IkakaoLogin {
  accessToken: string;
  tokenType: string;
}

export interface IConfimTel {
  authCode: string;
  tel: string;
}

export interface IAuthTel {
  tel: string;
}

export interface IAavilabiltyEmail {
  email: string;
}

export interface ISignupUser {
  appleToken?: string;
  authCode: string;
  birthDate: string;
  email: string;
  gender: string;
  marketingEmailReceived: boolean;
  marketingSmsReceived: boolean;
  name: string;
  nickName: string;
  password: string;
  tel: string;
}

export interface IUser {
  id: number;
  birthDate: string;
  email: string;
  emailReceived: boolean;
  gender: string;
  name: string;
  nickname: string;
  password: string;
  smsReceived: boolean;
  tel: string;
  point: number;
  emailConfirmed: boolean;
  telConfirmed: boolean;
  smsDenied: boolean;
  promotionCode: string;
  promotionCount: number;
  recommendCode: boolean;
  joinType: string;
  createdAt: string;
}

export interface ILogin {
  accessToken?: string;
  email: string;
  loginType: string;
  password: string;
}

export interface IResponse {
  code: number;
  message: string;
}

export interface IPagination {
  page: number;
  size: number;
  total: number;
  totalPage: number;
}

export interface IUserToken {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  tokenType: string;
  tmpPasswordUsed?: boolean;
}
export interface ILoginResponse {
  code: number;
  message: string;
  data?: IUserToken;
}

export interface ISignupResponse {
  code: number;
  message: string;
  data?: IUserToken;
}

export interface ISecessionRequest {
  answer: string;
  answerDetail: string;
  question: string;
}
export interface ISecessionResponse {
  code: number;
  message: string;
}

export interface IConfirmTelResponse {
  code: number;
  message: string;
  data: {
    availability: boolean;
  };
}

export interface IHelpEmail {
  name: string;
  tel: string;
}

export interface IHelpPassword {
  email: string;
  tel: string;
}

export interface IChangePassword {
  newPassword: string;
  oldPassword?: string;
}
export interface IInvitation {
  invitationPointValidDays: number;
  invitationPointValue: number;
  joinCount: number;
  orderCount: number;
  recommendationPointValue: number;
  totalPoint: number;
}
export interface IInvitationResponse {
  code: number;
  message: string;
  data: IInvitation;
}

export interface IChangeMe {
  authCode?: string;
  birthDate: string;
  gender: string;
  email: string;
  marketingEmailReceived: boolean;
  marketingPushReceived: boolean;
  marketingSmsReceived: boolean;
  name: string;
  nickName: string;
  notiPushReceived: boolean;
  primePushReceived: boolean;
  tel: string;
}
export interface IJusoRequest {
  query: string;
  page: number;
}

export interface IJusoResponse {
  results: {
    common: ICommon;
    juso: Array<IJuso>;
  };
}

export interface IAddress {
  readonly zipCode: string | null;
  readonly roadAddress: string | null;
  readonly buildName: string | null;
  readonly jibunAddress: string | null;
}

export interface IJuso {
  readonly roadAddr: string | null;
  readonly roadAddrPart1: string | null;
  readonly roadAddrPart2: string | null;
  readonly jibunAddr: string | null;
  readonly engAddr: string | null;
  readonly zipNo: string | null;
  readonly admCd: string | null;
  readonly rnMgtSn: string | null;
  readonly bdMgtSn: string | null;
  readonly detBdNmList: string | null;
  readonly bdNm: string | null;
  readonly bdKdcd: string | null;
  readonly siNm: string | null;
  readonly sggNm: string | null;
  readonly emdNm: string | null;
  readonly liNm: string | null;
  readonly rn: string | null;
  readonly udrtYn: string | null;
  readonly buldMnnm: string | null;
  readonly buldSlno: string | null;
  readonly mtYn: string | null;
  readonly lnbrMnnm: string | null;
  readonly lnbrSlno: string | null;
  readonly emdNo: string | null;
}

export interface ICommon {
  totalCount: string;
  currentPage: string;
  countPerPage: string;
  errorCode: string;
  errorMessage: string;
}

/* DESTINATION */

export type TDeliveryType = 'QUICK' | 'MORNING' | 'SPOT' | 'PARCEL';

export interface IRegisterDestinationRequest {
  address: string | null;
  addressDetail: string;
  delivery?: string;
  deliveryMessage?: string;
  deliveryMessageType?: string;
  dong?: string | null;
  main: boolean;
  name: string;
  receiverName?: string;
  receiverTel?: string;
  zipCode: string | null;
}

export interface IRegisterDestination {
  id: number;
  delivery: string;
  name: string;
  receiverName: string;
  receiverTel: string;
  location: ILocation;
  main: boolean;
  createdAt: string;
  deliveryMessage: string;
}

export interface IRegisterDestinationResponse {
  code: number;
  message: string;
  data: IRegisterDestination;
}

export interface IAvilabiltyAddress {
  jibunAddress?: string | null;
  roadAddress: string | null;
  zipCode: string | null;
  delivery?: TDeliveryType | null | string;
}

export interface IAvilabiltyAddressResponse {
  code: number;
  message: string;
  data: {
    morning: boolean;
    parcel: boolean;
    quick: boolean;
    spot: boolean;
  };
}

export interface ILocation {
  address: string;
  addressDetail: string;
  zipCode: string;
  dong: string;
}

export interface ISpotInSpotPickUp {
  canDinnerDelivery: boolean;
  canLunchDelivery: boolean;
  coordinate: { lat: number; lon: number };
  dinnerDeliveryEndTime: string;
  dinnerDeliveryStartTime: string;
  distance: number;
  distanceUnit: string;
  id: number;
  images: IMenuImage[];
  location: ILocation;
  lunchDeliveryEndTime: string;
  lunchDeliveryStartTime: string;
  name: string;
  type: string;
}
export interface ISpotPickupInDestinaion {
  id: number;
  name: string;
  spot: ISpotInSpotPickUp;
  type: string;
}

export interface IDestinationsResponse {
  id?: number;
  delivery?: TDeliveryType | string;
  deliveryMessage?: string;
  deliveryMessageType?: string;
  name?: string;
  receiverTel?: string;
  receiverName?: string;
  location?: ILocation;
  main?: boolean;
  createdAt?: string;
  spotPickup?: ISpotPickupInDestinaion;
  spaceType?: string;
  availableTime?: string;
}

export interface IGetDestinationsResponse {
  code: number;
  message: string;
  data: {
    destinations: IDestinationsResponse[];
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPage: number;
    };
  };
}

export interface IGetDestinationsRequest {
  page: number;
  size: number;
}

export interface IEditDestinationRequest {
  address: string | undefined;
  addressDetail: string | undefined;
  delivery: TDeliveryType | undefined;
  deliveryMessage?: string;
  dong: string | undefined;
  main: boolean;
  name?: string;
  id: number;
  receiverName?: string;
  receiverTel?: string;
  zipCode: string | undefined;
}

export interface IGetMainDestinationsRequest {
  delivery: TDeliveryType | string;
}

export interface IGetMainDestinationsResponse {
  code: number;
  message: string;
  data: IDestinationsResponse;
}

export interface IKakaoAddress {
  query: string | null;
  analyze_type?: string;
  page?: number;
  size?: number;
}
export interface IKakaoLatLon {
  x: string;
  y: string;
}

export interface IParamsSpots {
  latitude: number | null;
  longitude: number | null;
  page?: number;
  size?: number;
  keyword?: string;
}

export interface ISpotsResponse {
  code: number;
  message: string;
  data: ISpots;
}

export interface ISpots {
  title: string;
  spots: ISpotsDetail[];
}

export interface ISpotsDetail {
  submit: any;
  coordinate: {
    lat: number;
    lon: number;
  };
  title: string;
  canParking: boolean;
  canDinnerDelivery: boolean;
  canEat: boolean;
  discountRate: number;
  canLunchDelivery: boolean;
  isEvent: boolean;
  isTrial: boolean;
  visiblePlaceTel: boolean;
  createdAt: string;
  description: string;
  dinnerDelivery: boolean;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  lunchDelivery: boolean;
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  eventTitle: string;
  id: number | undefined;
  distance: number;
  distanceUnit: string;
  score: number;
  userCount: number;
  recruitingCount: number;
  recruited: boolean;
  placeName: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
      main: boolean;
      size: number;
      createdAt: string;
    }
  ];
  likeCount: number;
  liked: boolean;
  location: ILocation;
  name: string;
  notices: [
    {
      id: number;
      spotId: number;
      content: string;
      createdAt: string;
    }
  ];
  pickupEndTime: string;
  pickupStartTime: string;
  pickups: [
    {
      createdAt: string;
      id: number;
      images: [];
      name: string;
      spotId: number;
      type: string;
    }
  ];
  placeHoliday: string;
  placeOpenTime: string;
  placeTel: string;
  placeType: string;
  stories: [
    {
      id: number;
      spotId: number;
      type: string;
      title: string;
      content: string;
      createdAt: string;
      images: [
        {
          url: string;
        }
      ];
      liked: boolean;
      likeCount: number;
    }
  ];
  type: string;
  image: {
    url: string;
    width: number;
    height: number;
    size: number;
    main: boolean;
    createdAt: string;
  };
}

export interface ISpotDetailResponse {
  code: number;
  messages: string;
  data: ISpotsDetail;
}

export interface ISpotStories {
  id: number;
  spotId: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  images: [
    {
      url: string;
      width: string;
      height: string;
      size: string;
    }
  ];
}

export interface ISpotWishListResponse {
  code: number;
  messages: string;
  data: {
    spots: ISpotsDetail[];
    title: string;
    pagination: {
      total: number;
      totalPage: number;
      page: number;
      size: number;
    };
  };
}

export interface ISpotDetailStoriesResponse {
  code: number;
  messages: string;
  data: {
    spotStories: ISpotStories[];
    pagination: {
      total: number;
      totalPage: number;
      page: number;
      size: number;
    };
  };
}

export interface ISpotsInfo {
  spotCount: number;
  unsubmitSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  recruitingSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  confirmSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  trialSpotRegistrations: [];
}

export interface ISpotsInfoResponse {
  code: number;
  message: string;
  data: ISpotsInfo;
}

export interface ISpotRegistrationsResponse {
  data: {
    title: string;
    subTitle: string;
    spotRegistrations: [
      {
        id: number;
        placeName: string;
        image: {
          id: number;
          name: string;
          url: string;
          width: number;
          height: number;
          size: number;
          createdAt: string;
        };
        recruited: boolean;
        recruitingCount: number;
        distance: number;
        distanceUnit: string;
      }
    ];
  };
}

/* CARD */
export interface IRegisterCardResponse {
  code: number;
  message: string;
  data: IRegisterCard;
}

export interface IRegisterCard {
  birthDate?: string | null;
  corporationNo?: string | null;
  expiredMM: string;
  expiredYY: string;
  main: boolean;
  name?: string;
  number: string;
  password?: string;
  type: string;
}

export interface IGetCard {
  id: number;
  type: string;
  name: string;
  main: boolean;
  createdAt: string;
}
export interface IGetCardResponse {
  code: number;
  message: string;
  data: IGetCard[];
}

/* BANNER */
export interface IBanners {
  content: string;
  createdAt: string;
  endedAt: string;
  href: string;
  id: number;
  imageHeight: number;
  imageUrl: string;
  imageWidth: number;
  login: boolean;
  option: {
    bgColor: string;
    fontColor: string;
    mobileImageHeight: number;
    mobileImageUrl: string;
    mobileImageWidth: string;
    paths: string[];
  };
  priority: number;
  startedAt: string;
  status: string;
  title: string;
  type: string;
}

export interface IGetBannersResponse {
  code: number;
  message: string;
  data: IBanners[];
}

type BannerType = 'CAROUSEL' | 'CATEGORY' | 'EVENT' | 'EXHIBITION' | 'IMAGE' | 'MENU' | 'ORDER';

export interface IBanner {
  type: string;
}
export interface ITermRequest {
  type: string;
}

export interface ITerm {
  terms: {
    content: string;
    createdAt: string;
    endedAt: string;
    startedAt: string;
    type: string;
    version: number;
  };
  versions: IVersion[];
}

export interface IVersion {
  endedAt: string;
  startedAt: string;
  version: number;
}

export interface ITermResponse {
  code: number;
  message: string;
  data: ITerm;
}

export type TSpotRegisterationsOptiosType = 'PRIVATE' | 'PUBLIC' | 'OWNER';

export interface IParamsSpotRegisterationsOptios {
  type: TSpotRegisterationsOptiosType | string | undefined;
}

export interface ISpotRegisterationsOpstions {
  lunchTimeOptions: [
    {
      name: string;
      value: string;
    }
  ];
  placeTypeOptions: [
    {
      name: string;
      value: string;
    }
  ];
  pickupLocationTypeOptions: [
    {
      name: string;
      value: string;
    }
  ];
}

export interface ISpotRegisterationsOptiosResponse {
  code: number;
  message: string;
  data: ISpotRegisterationsOpstions;
}

export type TSpotPickupType =
  | 'COMMUNAL_FRIDGE'
  | 'COMMUNAL_TABLE'
  | 'DELIVERY_LOCATION'
  | 'DOCUMENT_ROOM'
  | 'ETC'
  | 'FRONT_DESK'
  | 'OFFICE_DOOR';

export type TPlaceType =
  | 'BOOKSTORE'
  | 'CAFE'
  | 'CONVENIENCE_STORE'
  | 'DRUGSTORE'
  | 'ETC'
  | 'FITNESS_CENTER'
  | 'OFFICE'
  | 'SCHOOL'
  | 'SHARED_OFFICE'
  | 'STORE';

type TDistanceUnit =
  | 'CENTIMETERS'
  | 'FEET'
  | 'INCH'
  | 'KILOMETERS'
  | 'METERS'
  | 'MILES'
  | 'MILLIMETERS'
  | 'NAUTICALMILES'
  | 'YARD';

export interface IEditRegistration {
  coordinate: {
    lat: number;
    lon: number;
  };
  location: {
    address?: string | null;
    addressDetail?: string | null;
    dong?: string | null;
    zipCode?: string | null;
  };
  lunchTime?: string;
  pickupType?: TSpotPickupType;
  placeName?: string | null;
  placeType?: TPlaceType;
  placeTypeDetail?: string | null;
  pickupTypeDetail?: string | null;
  type?: TSpotRegisterationsOptiosType | string;
  userEmail: string;
  userName: string;
  userPosition?: string | null;
  userTel: string;
}

export interface IPostRegistrations {
  coordinate: {
    lat: number;
    lon: number;
  };
  createdAt?: string;
  distance?: number;
  distanceUnit?: TDistanceUnit;
  id: number;
  image: {
    createdAt: string;
    height: number;
    id: number;
    name: string;
    originalName: string;
    size: number;
    url: string;
    width: number;
  };
  location: ILocation;
  lunchTime?: string;
  pickupType?: TSpotPickupType;
  placeName?: string | null;
  placeType?: TPlaceType;
  placeTypeDetail?: string | null;
  pickupTypeDetail?: string | null;
  orderUserCount: number;
  recruited: boolean;
  recruitingCount: number;
  rejected: boolean;
  rejectedAt: string;
  rejectionMessage: string;
  rejectionType: 'ETC' | 'INSUFFICIENCY';
  spotId: number;
  step: 'CONFIRM' | 'OPEN' | 'RECRUITING' | 'TRIAL' | 'UNSUBMIT';
  trialledAt: string;
  type: TSpotRegisterationsOptiosType;
  userEmail: string;
  userId: string;
  userName: string;
  userPosition: string;
  userTel: string;
}

export interface IPostRegistrationResponse {
  code: number;
  message: string;
  data: IPostRegistrations;
}

export interface IGetSpotsRegistrationsStatus {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  };
  spotRegistrations: [IEditRegistration];
}

export interface IGetSpotsRegistrationsStatusResponse {
  code: number;
  message: string;
  data: IGetSpotsRegistrationsStatus;
}

export interface IGetSpotFilterResponse {
  code: number;
  message: string;
  data: IGetSpotFilter;
}

export interface IGetSpotFilter {
  publicFilters: [
    {
      value: string | boolean;
      filtered: boolean;
      fieldName: string;
      name: string;
    }
  ];
  etcFilters: [
    {
      value: string | boolean;
      filtered: boolean;
      fieldName: string;
      name: string;
    }
  ];
}

/* ORDER */

export type TOrderType = 'GENERAL' | 'SUBSCRIPTION';
export type TPayMethod =
  | 'KAKAO_CARD'
  | 'KAKAO_MONEY'
  | 'NICE_BANK'
  | 'NICE_BILLING'
  | 'NICE_CARD'
  | 'PAYCO_EASY'
  | 'TOSS_CARD'
  | 'TOSS_MONEY';
export interface ICreateOrderRequest {
  coupon: number;
  delivery: string;
  deliveryDetail: string;
  deliveryFee: number;
  deliveryFeeDiscount: number;
  destinationId: number;
  location: ILocation;
  menuAmount: number;
  menuDiscount: number;
  optionAmount: number;
  name: string;
  type: string;
  payMethod: TPayMethod | string;
  cardId: number;
  userName: string;
  userTel: string;
  userEmail: string;
  receiverName: string;
  receiverTel: string;
  eventDiscount: number;
  point: number;
  payAmount: number;
  isSubOrderDelivery: boolean;
  orderDeliveries: IOrderRequestInOrderDeliveries[];
}

export interface IOrderRequestInOrderDeliveries {
  deliveryDate: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
  receiverName: string;
  receiverTel: string;
  location: ILocation;
  orderMenus: IOrderMenus[];
  orderOptions: IOrderOptions[];
}

export interface IGetOrderListRequest {
  days: number;
  page: number;
  size: number;
  type: TOrderType | string;
}

export interface IOrderMenus {
  id?: number;
  menuId: number;
  menuName: string;
  menuDetailId: number;
  menuDetailName: string;
  menuPrice: number;
  menuDiscount: number;
  menuQuantity: number;
  image: {
    id: number;
    name?: string;
    url: string;
    width: number;
    height: number;
    size?: number;
    createdAt?: string;
  };
}

export interface IOrderInOrderList {
  delivery: string;
  deliveryDetail?: string;
  id: number;
  name: string;
  paidAt: string;
  payAmount: number;
  type: string;
  amount: number;
}

export interface IOrder {
  id: number;
  name: string;
  paidAt: string;
  type: string;
  payAmount: number;
}

export interface IOrderDeliveriesInSpot {
  id: number;
  type: string;
  name: string;
  description: string;
  location: ILocation;
  canLunchDelivery: boolean;
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  canDinnerDelivery: false;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  pickupStartTime: string;
  pickupEndTime: string;
  coordinate: {
    lat: number;
    lon: number;
  };
  placeType: string;
  visiblePlaceTel: boolean;
  placeTel: string;
  placeOpenTime: string;
  placeHoliday: string;
  isTrial: boolean;
  canEat: boolean;
  canParking: boolean;
  isEvent: boolean;
  discountRate: number;
  createdAt: string;
}
export interface IOrderDeliveriesInSpotPickUp {
  id: number;
  spotId: number;
  name: string;
  createdAt: string;
}
export interface IOrderDetailInOrderDeliveries {
  id: number;
  delivery: TDeliveryType;
  deliveryDetail: string;
  deliveryDate: string;
  deliveryEndTime: string;
  deliveryStartTime: string;
  receiverName: string;
  receiverTel: string;
  location: ILocation;
  deliveryMessageType?: string;
  deliveryMessage?: string;
  spotName: string;
  spotPickupId: number;
  spotPickupName: string;
  spotPickupType: string;
  status: string;
  orderMenus: IOrderMenus[];
  type: string;
  subOrderDelivery: ISubOrderDelivery;
}

export interface IEditOrderDestination {
  deliveryMessage: string;
  deliveryMessageType: string;
  location: ILocation;
  receiverName: string;
  receiverTel: string;
}

export interface IEditOrderSpotDestination {
  receiverName: string;
  receiverTel: string;
  spotPickupId: number;
}
export type TDeliveryStatus = 'CANCELED' | 'COMPLETED' | 'DELIVERING' | 'PREPARING' | 'PROGRESS' | string;

export interface IGetOrderInImage {
  createdAt: string;
  height: number;
  id: number;
  name: string;
  originalName: string;
  size: number;
  url: string;
  width: number;
}

export interface IOrderMenusInOrderList {
  menuDetailId: number;
  menuQuantity: number;
}

export interface IOrderOptions {
  id?: number;
  optionId: number;
  optionName: string;
  optionPrice: number;
  optionQuantity: number;
}

export interface ISpotInSubOrder {
  id: number;
  type: string;
  name: string;
  description: string;
  location: ILocation;
  canLunchDelivery: boolean;
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  canDinnerDelivery: boolean;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  pickupStartTime: string;
  pickupEndTime: string;
  coordinate: {
    lat: number;
    lon: number;
  };
  placeType: string;
  visiblePlaceTel: boolean;
  placeTel: string;
  placeOpenTime: string;
  placeHoliday: string;
  isTrial: false;
  canEat: true;
  canParking: true;
  isEvent: true;
  discountRate: number;
  createdAt: string;
}

export interface ISubOrderDelivery {
  delivery: string;
  deliveryDetail: string;
  deliveryDate: string;
  id: number;
  location: ILocation;
  image: IGetOrderInImage;
  orderMenus: IOrderMenusInOrderList[];
  orderOptions: IOrderOptions[];
  spot?: ISpotInSubOrder;
  spotId?: number;
  spotName?: string;
  spotPickupId?: number;
  status?: string;
  deliveryDateChangeCount: number;
  deliveryDateChangeMaximum: number;
  order: IOrderInOrderList;
  type: string;
}

export interface IGetOrderList {
  delivery: string;
  deliveryDetail: string;
  deliveryDate: string;
  deliveryDateChangeCount: number;
  deliveryDateChangeMaximum: number;
  id: number;
  location: ILocation;
  image: IGetOrderInImage;
  orderMenus: IOrderMenusInOrderList[];
  orderOptions: IOrderOptions[];
  spotId?: number;
  spotName?: string;
  spotPickupId: number;
  status: string;
  subOrderDelivery?: ISubOrderDelivery;
  order: IOrderInOrderList;
  type: string;
  name?: string;
}

export interface IGetOrderListResponse {
  message: string;
  code: number;
  data: {
    orderDeliveries: IGetOrderList[];
    pagination: IPagination;
  };
}

export interface IGetSubOrdersResponse {
  message: string;
  code: number;
  data: {
    orderDeliveries: ISubOrderDelivery[];
  };
}

export interface IOrderPayment {}

export interface IOrderDetail {
  id: number;
  delivery: TDeliveryType | string;
  deliveryDetail: string;
  name: string;
  menuAmount: number;
  refundMenuAmount: number;
  menuDiscount: number;
  refundMenuDiscount: number;
  eventDiscount: number;
  refundEventDiscount: number;
  deliveryFee: number;
  coupon: number;
  createdAt: string;
  deliveryFeeDiscount: number;
  deliveryStatus: TDeliveryStatus;
  image: IGetOrderInImage;
  orderDeliveries: IOrderDetailInOrderDeliveries[];
  orderPayment: IOrderPayment;
  paidAt: string;
  payAmount: number;
  optionAmount: number;
  optionQuantity: number;
  point: number;
  refundCoupon: number;
  refundDeliveryFee: number;
  refundDeliveryFeeDiscount: number;
  refundOrderDiscount: number;
  refundPayAmount: number;
  refundPoint: number;
  refundOptionQuantity: number;
  refundMenuQuantity: number;
  refundOptionAmount: number;
  status: string;
}

export interface IGetOrderDetailResponse {
  code: number;
  message: string;
  data: IOrderDetail;
}
export interface IOrderOptionsInOrderPreviewRequest {
  optionId: number;
  optionQuantity: number;
}
export interface IOrderDeliveriesInOrderPreviewRequest {
  deliveryDate: string;
  orderMenus: IOrderMenusInOrderList[];
  orderOptions: IOrderOptionsInOrderPreviewRequest[];
}
export interface IOrderPreviewRequest {
  delivery: string;
  deliveryDetail?: string | null;
  destinationId: number | undefined;
  isSubOrderDelivery: boolean;
  orderDeliveries: IOrderDeliveriesInOrderPreviewRequest[];
  type: string;
}
export interface ICreateOrderPreview {
  name: string;
  type: string;
  userName: string;
  userTel: string;
  userEmail: string;
  receiverName: string;
  receiverTel: string;
  delivery: string;
  deliveryDetail: string;
  location: ILocation;
  destinationId: number;
  menuAmount: number;
  menuDiscount: number;
  optionAmount: number;
  eventDiscount: number;
  deliveryFee: number;
  deliveryFeeDiscount: number;
  point: number;
  coupon: number;
  payAmount: number;
  orderDeliveries: [
    {
      delivery: string;
      deliveryDetail: string;
      deliveryDate: string;
      deliveryStartTime: string;
      deliveryEndTime: string;
      receiverName: string;
      receiverTel: string;
      location: ILocation;
      subOrderDelivery?: ISubOrderDelivery | null;
      spotId: number;
      spotName: string;
      spotPickupId: number;
      spotPickupName: string;
      orderMenus: IOrderMenus[];
      orderOptions: IOrderOptions[];
    }
  ];
  isSubOrderDelivery: boolean;
}
export interface ICreateOrderPreviewResponse {
  code: number;
  message: string;
  data: {
    order: ICreateOrderPreview;
    coupons: ICoupon[];
    point: number;
    cards: IGetCard[];
    isSubOrderDelivery: boolean;
  };
}

export interface ICreateOrder {
  id: number;
  delivery: string;
  deliveryDetail?: string;
  deliveryMessage?: string;
  deliveryMessageType?: string;
  isDeliveryTogether: boolean;
  name: string;
  menuQuantity: number;
  refundMenuQuantity: number;
  optionQuantity: number;
  refundOptionQuantity: number;
  menuAmount: number;
  refundMenuAmount: number;
  menuDiscount: number;
  refundMenuDiscount: number;
  optionAmount: number;
  refundOptionAmount: number;
  eventDiscount: number;
  refundEventDiscount: number;
  deliveryFee: number;
  refundDeliveryFee: number;
  deliveryFeeDiscount: number;
  refundDeliveryFeeDiscount: number;
  point: number;
  refundPoint: number;
  coupon: number;
  refundCoupon: number;
  status: string;
  createdAt: string;
  paidAt: string;
  orderDeliveries: [
    {
      id: number;
      delivery: string;
      deliveryDetail: string;
      deliveryDate: string;
      receiverName: string;
      receiverTel: string;
      location: ILocation;
      spot?: IOrderDeliveriesInSpot;
      spotPickup?: IOrderDeliveriesInSpotPickUp;
      status: string;
      orderMenus: IOrderMenus[];
      orderOptions: IOrderOptions[];
    }
  ];
}
export interface ICreateOrderResponse {
  code: number;
  message: string;
  data: ICreateOrder;
}

/* MENU */

export type TCategory = 'DAIRY_PRODUCTS' | 'MEAT' | 'SEAFOOD' | 'VEGAN';
export type TMenuSort = 'LAUNCHED_DESC' | 'ORDER_COUNT_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'REVIEW_COUNT_DESC';
export type TType =
  | 'DRINK'
  | 'KOREAN_SOUP_SOUP'
  | 'LUNCH_BOX_CONVENIENCE_FOOD'
  | 'SALAD'
  | 'SET'
  | 'SNACK'
  | 'WRAP_SANDWICH';
export interface IGetMenus {
  categories: TCategory | string;
  menuSort: TMenuSort | string;
  searchKeyword: string;
  type: TType | string;
}

export interface IMenuImage {
  height: number;
  id: number;
  url: string;
  width: number;
}

export interface IMenuDetails {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  main: boolean;
  dailyMaximum: number;
  isSold: number;
}

export interface IMenus {
  id: number;
  name: string;
  type: string;
  category: string;
  description: string;
  thumbnail: string;
  badgeMessage: string;
  launchedAt: string;
  liked: boolean;
  likeCount: number;
  reviewCount: number;
  menuDetails: IMenuDetails[];
  menuSort: string;
  orderCount: number;
  priority: string;
  closedAt: string;
  openedAt: string;
  subscriptionDelivery?: string;
  subscriptionPeriods?: string;
}

/* REVIEW */
export interface IGetMenusResponse {
  code: number;
  data: IMenus[];
  message: string;
}
export interface ISearchReviews {
  id: number;
  userNickName: string;
  menuName: string;
  menuDetailName: string;
  orderCount: number;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ISearchReviewImages {
  id: number;
  url: string;
  width: number;
  height: number;
  size: number;
}
export interface IMenuReviews {
  searchReviews: ISearchReviews[];
  searchReviewImages: ISearchReviewImages[];
}

export interface IMenuReviewsResponse {
  code: number;
  data: IMenuReviews[];
  message: string;
}

export interface IReviewsDetailResponse {
  code: number;
  message: string;
  data: {
    searchReview: ISearchReviews;
    searchReviewImages: ISearchReviewImages[];
  };
}

export interface IPostMenuReview {
  files: FormData;
  content: string;
  menuDetailId: number;
  menuId: number;
  menuReviewImages: [
    {
      height: number;
      main: boolean;
      name: string;
      priority: number;
      size: number;
      width: number;
    }
  ];
  orderDeliveryId: number;
  rating: number;
}

export interface IPostMenuReviewResponse {}

export interface ICompletionReviewImg {
  id: number;
  menuReviewId: number;
  url: string;
  width: number;
  height: number;
  size: number;
}
export interface ICompletionReviews {
  id: number;
  userNickName: string;
  menuName: string;
  menuDetailName: string;
  rating: number;
  content: string;
  createdAt: string;
  images: ICompletionReviewImg[];
}

export interface ICompletionReviewsResponse {
  code: number;
  message: string;
  data: ICompletionReviews[];
}

export interface IWillWriteReview {
  delivery: TDeliveryType | string;
  deliveryDate: string;
  height: number;
  menuDetailId: number;
  menuDetailName: string;
  menuId: number;
  menuName: string;
  orderDeliveryId: number;
  url: string;
  width: number;
}

export interface IWillWriteReviewsResponse {
  code: number;
  message: string;
  data: IWillWriteReview[];
}
declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

/* CART */

export type TCartMenuSize = 'BOX' | 'EA' | 'LARGE' | 'MEDIUM' | 'SMALL' | string;
export type TCartMenuStatus = 'DELETED' | 'HIDDEN' | 'NORMAL' | string;

export interface IMenuDetailsInCart {
  menuDetailId: number;
  name: string;
  price: number;
  menuQuantity: number;
  calorie: number;
  protein: number;
  isSold: boolean;
  main: boolean;
  status: TCartMenuStatus;
}

export interface IGetCart {
  menuId: number;
  menuName: string;
  image: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  menuDetails: IMenuDetailsInCart[];
}

export interface IGetCartResponse {
  code: number;
  message: string;
  data: IGetCart[];
}
export interface ICreateCartRequest {
  main: boolean;
  menuDetailId: number;
  menuId: number;
  menuQuantity?: number | null;
}

export interface IDeleteCartRequest {
  menuDetailId: number;
  menuId: number;
}

export interface IPatchCartRequest {
  menuDetailId: number;
  menuQuantity: number;
}

/* COUPON */

export interface IMenuInCoupon {
  badgeMessage: string;
  category: string;
  description: string;
  id: number;
  menuDetails: IMenuDetails[];
  menuSort: TMenuSort | string | null;
  name: string;
  orderCount: number | null;
  priority: number | null;
  thumbnail: string;
  type: string;
}
export interface ICoupon {
  createdAt: string;
  criteria: string;
  descriptions: string[];
  expiredDate: string;
  id: number;
  isApp: false;
  name: string;
  value: number;
}

export interface ICouponResponse {
  message: string;
  code: number;
  data: ICoupon[];
}

/* POINT */
export interface IPoint {
  availablePoint: number;
  expirePoint: number;
}
export interface IPointResponse {
  code: number;
  message: string;
  data: IPoint;
}
export interface IPointHistories {
  content: string;
  createdAt: string;
  expiredDate: string;
  id: number;
  type: TPointHistoryType;
  value: number;
}

export interface IPointHistoriesResponse {
  code: number;
  message: string;
  data: { pointHistories: IPointHistories[]; pagination: {} };
}

type TPointHistoryType = 'EXPIRATION' | 'SAVE' | 'USE' | string;

export interface IPointHistoriesRequest {
  page: number;
  size: number;
  types: TPointHistoryType;
}

/* PRMOTION */

type TReward = 'COUPON' | 'POINT' | string;
export interface IPromotionRequest {
  code: string;
  reward: TReward;
}
