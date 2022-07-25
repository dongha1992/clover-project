import { useState, useEffect } from "react";

const useCurrentLocation = (options = {}) => {
  // location 정보 저장
  const [location, setLocation] = useState<any>();
  // 에러 메세지 저장
  const [error, setError] = useState<string>('');
  const [currentArrowed, setCurrentArrowed] = useState<boolean>(false);

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
    setError(error.message);
    setCurrentArrowed(true);
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

  const onClickCurrentPosition = () => {
    const { geolocation } = navigator;
    if (!geolocation) {
        setCurrentArrowed(true);
        setError("Geolocation is not supported.");
        return;
      }
      // Geolocation API 호출
      geolocation.getCurrentPosition(handleSuccess, handleError, options);
  };

  return { location, error, currentArrowed, onClickCurrentPosition };
};

export default useCurrentLocation;