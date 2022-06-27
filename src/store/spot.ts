import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { 
  ISpotsDetail, 
  IPostRegistrations, 
  ISpotsInfo, 
  IGetRegistrationStatus 
} from '@model/index';

interface ISpotAddress {
  addressDetail?: string | undefined;
  address?: string | null;
  bdNm?: string | null;
  dong?: string | null;
  zipCode?: string | null;
  lat?: string | null;
  lon?: string | null;
  jibunAddress?: string | null;
  roadAddress?: string | null;
}

interface ISpotRegistrationsOpions {
  placeTypeOptions?: {
    name: string;
    value: string;
  };
  lunchTimeOptions?: {
    name: string;
    value: string;
  };
}

 export interface ISpotsRegistrationInfo {
  placeName?: string | null;
  pickupLocation?: string | null;
  placeTypeEtc?: string | null;
  userName: string;
  userEmail: string;
  userTel: string;
  managerInfo?: string | null;
}

interface ISpotsPostions {
  latitude: number | string | null;
  longitude: number | string | null;
}

interface IProps {
  spotDetail: ISpotsDetail | null;
  isSpotLiked: boolean;
  spotLocation: ISpotAddress;
  spotsRegistrationOptions: ISpotRegistrationsOpions | any;
  spotsRegistrationInfo: ISpotsRegistrationInfo | any;
  spotRegistrationsPostResult: IPostRegistrations | any;
  spotsPosition: ISpotsPostions | any;
  spotSearchSelectedFilters: string[];
  spotPickupId: number | null;
  spotInfo: ISpotsInfo | null;
  spotSearchSort: string;
  spotJoinFormChecked: boolean;
  spotStatusDetail: IGetRegistrationStatus | null;
  spotKeyword: string;
  isMapSwitch: boolean;
  spotSearchArr: ISpotsDetail[];
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
  roadAddress: '',
};

const spotRegistrationsOptionsState = {
  lunchTimeOptions: {},
  placeTypeOptions: {},
};

const spotsRegistrationInfoState = {
  placeName: '',
  pickupLocation: '',
  placeTypeEtc: '',
  userName: '',
  userEmail: '',
  userTel: '',
  managerInfo: '',
};

const spotsPostionsState = {
  latitude: null,
  longitude: null,
};

const initialState: IProps = {
  spotDetail: null,
  spotStatusDetail: null,
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
  spotPickupId: null,
  spotInfo: null,
  spotSearchSelectedFilters: [],
  spotSearchSort: '',
  spotJoinFormChecked: false,
  spotKeyword: '',
  isMapSwitch: false,
  spotSearchArr: [],
};

export const spot = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    // 스팟 상세 페이지 정보
    SPOT_ITEM: (state, action: PayloadAction<ISpotsDetail | null>) => {
      state.spotDetail = action.payload;
    },
    INIT_SPOT_LIKED: (state, action: PayloadAction) => {
      state.isSpotLiked = false;
    },
    SET_SPOT_LIKED: (state, action: PayloadAction) => {
      state.isSpotLiked = true;
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
    INIT_SPOT_POSITIONS: (state, action: PayloadAction) => {
      state.spotsPosition = spotsPostionsState;
    },
    SET_SPOT_PICKUP_ID: (state, action: PayloadAction<number | null>) => {
      state.spotPickupId = action.payload;
    },
    SET_SPOT_INFO: (state, action: PayloadAction<ISpotsInfo | null>) => {
      state.spotInfo = action.payload;
    },
    SET_SPOT_SEARCH_SELECTED_FILTERS: (state, action: PayloadAction<string[]>) => {
      state.spotSearchSelectedFilters = action.payload;
    },
    INIT_SEARCH_SELECTED_FILTERS : (state, action: PayloadAction) => {
      state.spotSearchSelectedFilters = [];
    },
    SET_SPOT_SEARCH_SORT : (state, action: PayloadAction<string>) => {
      state.spotSearchSort = action.payload;
    },
    INIT_SPOT_SEARCH_SORT : (state, action: PayloadAction) => {
      state.spotSearchSort = '';
    },
    SET_SPOT_JOIN_FORM_CHECKED : (state, action: PayloadAction<boolean>) => {
      state.spotJoinFormChecked = action.payload;
    },
    INIT_SPOT_JOIN_FORM_CHECKED : (state, action: PayloadAction) => {
      state.spotJoinFormChecked = false;
    },
    SET_SPOT_STATUS_DETAIL_ITEMS: (state, action: PayloadAction<IGetRegistrationStatus | null>) => {
      state.spotStatusDetail = action.payload;
    },
    SET_SEARCH_KEYWORD: (state, action: PayloadAction<string>) => {
      state.spotKeyword = action.payload;
    },
    SET_SPOT_MAP_SWITCH: (state, action : PayloadAction) => {
      state.isMapSwitch = true;
    },
    INIT_SPOT_MAP_SWITCH: (state, action : PayloadAction) => {
      state.isMapSwitch = false;
    },
    SET_SERACH_MAP_SPOT: (state, action: PayloadAction<ISpotsDetail[]>) => {
      state.spotSearchArr = action.payload;
    },
  },
});

export const {
  SPOT_ITEM,
  SET_SPOT_STATUS_DETAIL_ITEMS,
  SET_SPOT_LIKED,
  INIT_SPOT_LIKED,
  SET_SPOT_LOCATION,
  INIT_SPOT_LOCATION,
  SET_SPOT_REGISTRATIONS_OPTIONS,
  INIT_SPOT_REGISTRATIONS_OPTIONS,
  SET_SPOT_REGISTRATIONS_INFO,
  SET_SPOT_REGISTRATIONS_POST_RESULT,
  SET_SPOT_POSITIONS,
  INIT_SPOT_POSITIONS,
  SET_SPOT_PICKUP_ID,
  SET_SPOT_INFO,
  SET_SPOT_SEARCH_SELECTED_FILTERS,
  INIT_SEARCH_SELECTED_FILTERS,
  SET_SPOT_SEARCH_SORT,
  INIT_SPOT_SEARCH_SORT,
  SET_SPOT_JOIN_FORM_CHECKED,
  INIT_SPOT_JOIN_FORM_CHECKED,
  SET_SEARCH_KEYWORD,
  SET_SPOT_MAP_SWITCH,
  INIT_SPOT_MAP_SWITCH,
  SET_SERACH_MAP_SPOT,
} = spot.actions;
export const spotSelector = (state: AppState): IProps => state.spot;
export default spot.reducer;
