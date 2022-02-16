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

interface IProps {
  spotDetail: ISpotsDetail | any;
  isSpotLiked: Boolean;
  spotLocation: ISpotAddress;
  spotsRegistrationOptions: ISpotRegistrationsOpions | any;
  spotsRegistrationInfo: ISpotsRegistrationInfo;
  spotRegistrationsPostResult: IPostRegistrations | any;
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
  userName: '프프코',
  userEmail: 'fco@freshcode.me',
  userTel: '01012341234',
  managerInfo: '',
};

const initialState: IProps = {
  spotDetail: {},
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
};

export const spot = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    SPOT_ITEM: (state, action: PayloadAction<ISpotsDetail>) => {
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
    INIT_SPOT_REGISTRATIONS_INFO: (state, action: PayloadAction) => {
      state.spotsRegistrationInfo = spotsRegistrationInfoState;
    },
    SET_SPOT_REGISTRATIONS_POST_RESULT: (state, action: PayloadAction<IPostRegistrations>) => {
      state.spotRegistrationsPostResult = action.payload;
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
  INIT_SPOT_REGISTRATIONS_INFO,
  SET_SPOT_REGISTRATIONS_POST_RESULT,
} = spot.actions;
export const spotSelector = (state: AppState): IProps => state.spot;
export default spot.reducer;
