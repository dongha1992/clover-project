import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { ISpotsDetail, IPostRegistrations } from '@model/index';

interface ISpotAddress {
  addressDetail?: string | undefined;
  address?: string | null;
  bdNm?: string | null; 
  dong?: string | null,
  zipCode?: string | null,
  lat?: string | null;
  lon?: string | null;
  jibunAddress?: string | null;
  roadAddress?: string | null;
};

interface ISpotRegistrationsOpions {
  pickupLocationTypeOptions?: {
    name: string;
    value: string;
  };
  placeTypeOptions?: {
    name: string;
    value: string;
  };
  lunchTimeOptions?: {
    name: string;
    value: string;
  };
};

interface ISpotsRegistrationInfo {
  placeName?: string | null;
  pickupLocationEtc?: string | null;
  placeTypeEtc?: string | null;
  userName: string;
  userEmail: string;
  userTel: string;
  managerInfo?: string | null;
};

interface ISpotsPostions {
  latitude: number | null;
  longitude: number | null;
}

interface IProps {
  spotDetail: ISpotsDetail | null;
  isSpotLiked: boolean;
  spotLocation: ISpotAddress;
  spotsRegistrationOptions: ISpotRegistrationsOpions | any;
  spotsRegistrationInfo: ISpotsRegistrationInfo | any;
  spotRegistrationsPostResult: IPostRegistrations | any;
  spotsPosition: ISpotsPostions | any;
  spotsPickupSelected: ISpotsDetail | null;
};

const spotAddressState = {
  addressDetail: '',
  address: '',
  bdNm: '',
  dong: '',
  zipCode: '',
  lat: '',
  lon: '',
  jibunAddress: '',
  roadAddress: ''
};

const spotRegistrationsOptionsState = {
  lunchTimeOptions: {},
  pickupLocationTypeOptions: {},
  placeTypeOptions: {},
};

const spotsRegistrationInfoState = {
  placeName: '',
  pickupLocationEtc: '',
  placeTypeEtc: '',
  userName: '',
  userEmail: '',
  userTel: '',
  managerInfo: '',
};

const spotsPostionsState = {
  latitude: '',
  longitude: '',
};

const initialState: IProps = {
  spotDetail: null,
  isSpotLiked: false,
  spotLocation: {
    ...spotAddressState,
  },
  spotsRegistrationOptions: {
    ...spotRegistrationsOptionsState,
  },
  spotsRegistrationInfo: {
    ...spotsRegistrationInfoState,
  },
  spotRegistrationsPostResult: {},
  spotsPosition: {
    ...spotsPostionsState,
  },
  spotsPickupSelected: null,
};

export const spot = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    // 스팟 상세 페이지 정보
    SPOT_ITEM: (state, action: PayloadAction<ISpotsDetail | null>) => {
      state.spotDetail = action.payload;
    },
    SET_SPOT_LIKED: (state, action : PayloadAction<boolean>) => {
      state.isSpotLiked = action.payload;
    },
    SET_SPOT_LOCATION: (state, action: PayloadAction<ISpotAddress>) => {
      state.spotLocation = action.payload;
    },
    INIT_SPOT_LOCATION: (state, action: PayloadAction) => {
      state.spotLocation = spotAddressState;
    },
    SET_SPOT_REGISTRATIONS_OPTIONS: (state, action: PayloadAction<ISpotRegistrationsOpions>) => {
      state.spotsRegistrationOptions = action.payload;
    },
    INIT_SPOT_REGISTRATIONS_OPTIONS: (state, action: PayloadAction) => {
      state.spotsRegistrationOptions = spotRegistrationsOptionsState;
    },
    SET_SPOT_REGISTRATIONS_INFO: (state, action: PayloadAction<ISpotsRegistrationInfo>) => {
      state.spotsRegistrationInfo = action.payload;
    },
    SET_SPOT_REGISTRATIONS_POST_RESULT: (state, action: PayloadAction<IPostRegistrations>) => {
      state.spotRegistrationsPostResult = action.payload;
    },
    SET_SPOT_POSITIONS: (state, action: PayloadAction<ISpotsPostions>) => {
      state.spotsPosition = action.payload;
    },
    // 스팟 검색, 주문하기->스팟 픽업장소
    SET_SPOT_PICKUP_SELECTED: (state, action: PayloadAction<ISpotsDetail | null>) => {
      state.spotsPickupSelected = action.payload;
    },
  },
});

export const { 
  SPOT_ITEM, 
  SET_SPOT_LIKED, 
  SET_SPOT_LOCATION, 
  INIT_SPOT_LOCATION, 
  SET_SPOT_REGISTRATIONS_OPTIONS,
  INIT_SPOT_REGISTRATIONS_OPTIONS,
  SET_SPOT_REGISTRATIONS_INFO,
  SET_SPOT_REGISTRATIONS_POST_RESULT,
  SET_SPOT_POSITIONS,
  SET_SPOT_PICKUP_SELECTED,
} = spot.actions;
export const spotSelector = (state: AppState): IProps => state.spot;
export default spot.reducer;
