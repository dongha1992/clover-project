import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@store/alert';
import { useRouter } from 'next/router';

const useCurrentLocation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [location, setLocation] = useState<any>();
  const [error, setError] = useState<string>('');
  const [currentArrowed, setCurrentArrowed] = useState<boolean>(false);

  const options = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: Infinity,
  };

  // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (pos: any) => {
    const { latitude, longitude } = pos.coords;
    setLocation({
      latitude,
      longitude,
    });
  };

  // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error: any) => {
    // setCurrentArrowed(true);
    const currentPath = router.pathname;
    if (currentPath === '/spot') {
      setError(error.message);
    } else {
      setError(error.message);
      dispatch(
        SET_ALERT({
          alertMessage: '위치 서비스를 사용하려면\n접근 권한을 허용해 주세요.',
          submitBtnText: '확인',
          onSubmit: () => {
            setCurrentArrowed(false);
          }
        })
      );  
    };
  };

  useEffect(() => {
    const { geolocation } = navigator;
    // 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리
    if (!geolocation) {
      setCurrentArrowed(true);
      setError("Geolocation is not supported.");
      return;
    };
  }, []);

  const handlerCurrentPosition = () => {
    const { geolocation } = navigator;
      // Geolocation API 호출
      if (geolocation) {
        setCurrentArrowed(true);
        geolocation.getCurrentPosition(handleSuccess, handleError, options);
      };
  };

  return { location, error, currentArrowed, handlerCurrentPosition };
};

export default useCurrentLocation;