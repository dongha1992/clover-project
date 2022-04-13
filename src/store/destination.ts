import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IJuso, IRegisterDestinationRequest, IDestinationsResponse } from '@model/index';
import { TLocationType } from '@utils/checkDestinationHelper';

interface IAvailableDestination {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
  spot: boolean;
}

interface TProps {
  userDestination: IDestinationsResponse | null;
  tempLocation: IJuso;
  userTempDestination: IDestinationsResponse | null;
  tempEditDestination: IDestinationsResponse | null;
  userLocation: IJuso;
  availableDestination: IAvailableDestination;
  destinationDeliveryType: string;
  userDeliveryType: string;
  locationStatus: TLocationType;
}

const locationState = {
  roadAddr: null,
  roadAddrPart1: null,
  roadAddrPart2: null,
  jibunAddr: null,
  engAddr: null,
  zipNo: null,
  admCd: null,
  rnMgtSn: null,
  bdMgtSn: null,
  detBdNmList: null,
  bdNm: null,
  bdKdcd: null,
  siNm: null,
  sggNm: null,
  emdNm: null,
  liNm: null,
  rn: null,
  udrtYn: null,
  buldMnnm: null,
  buldSlno: null,
  mtYn: null,
  lnbrMnnm: null,
  lnbrSlno: null,
  emdNo: null,
  detailJuso: null,
};

const INITIAL_STATE: TProps = {
  userDestination: null,
  userTempDestination: null,
  tempEditDestination: null,
  tempLocation: {
    ...locationState,
  },
  userLocation: {
    ...locationState,
  },
  availableDestination: {
    morning: false,
    quick: false,
    parcel: false,
    spot: false,
  },
  locationStatus: '',
  destinationDeliveryType: '',
  userDeliveryType: '',
};

export const destination = createSlice({
  name: 'destination',
  initialState: INITIAL_STATE,
  reducers: {
    SET_LOCATION: (state, action: PayloadAction<IJuso>) => {
      state.userLocation = action.payload;
    },

    // 유저 위치 정보 획득
    SET_LOCATION_STATUS: (state, action: PayloadAction<TLocationType>) => {
      state.locationStatus = action.payload;
    },

    // 위치 검색 후 획득 위치 (위치 설정 전)
    SET_LOCATION_TEMP: (state, action: PayloadAction<IJuso>) => {
      state.tempLocation = action.payload;
    },

    INIT_LOCATION_TEMP: (state, action: PayloadAction) => {
      state.tempLocation = locationState;
    },

    // 배송지 검색 후
    SET_DESTINATION: (state, action: PayloadAction<IDestinationsResponse | null>) => {
      state.userDestination = action.payload;
    },

    INIT_DESTINATION: (state, action: PayloadAction) => {
      state.userDestination = null;
    },

    // 서버에 등록하지 않은 유저가 검색한 배송지 정보
    SET_TEMP_DESTINATION: (state, action: PayloadAction<IDestinationsResponse | null>) => {
      state.userTempDestination = action.payload;
    },

    INIT_TEMP_DESTINATION: (state, action: PayloadAction) => {
      state.userTempDestination = null;
    },

    SET_AVAILABLE_DESTINATION: (state, action: PayloadAction<IAvailableDestination>) => {
      state.availableDestination = action.payload;
    },

    INIT_AVAILABLE_DESTINATION: (state, action: PayloadAction) => {
      state.availableDestination = { morning: false, quick: false, parcel: false, spot: false };
    },

    // 배송지 체크 api
    SET_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.destinationDeliveryType = action.payload;
    },

    INIT_DESTINATION_STATUS: (state, action: PayloadAction) => {
      state.destinationDeliveryType = '';
    },

    // 유저가 선택한 배송방법
    SET_USER_DESTINATION_STATUS: (state, action: PayloadAction<string>) => {
      state.userDeliveryType = action.payload;
    },

    INIT_USER_DESTINATION_STATUS: (state, action: PayloadAction) => {
      state.userDeliveryType = '';
    },
  },
});

export const {
  SET_DESTINATION,
  INIT_DESTINATION,
  SET_TEMP_DESTINATION,
  INIT_TEMP_DESTINATION,
  SET_LOCATION,
  SET_LOCATION_TEMP,
  SET_LOCATION_STATUS,
  SET_AVAILABLE_DESTINATION,
  INIT_AVAILABLE_DESTINATION,
  INIT_LOCATION_TEMP,
  SET_DESTINATION_STATUS,
  INIT_DESTINATION_STATUS,
  SET_USER_DESTINATION_STATUS,
  INIT_USER_DESTINATION_STATUS,
} = destination.actions;
export const destinationForm = (state: AppState): TProps => state.destination;
export default destination.reducer;
