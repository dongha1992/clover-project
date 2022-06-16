// 처음 설정한 위치 좌표와 갱신된 위치 좌표의 거리 계산
// 구면 코사인 법칙으로 두 위도/경도 지점의 거리를 계산 (반환 거리 단위km)
const getComputeDistance = (startLat: number, startLon: number, desLat: number, desLon: number) => {
    function degreesToRadians(degrees : number) {
        return (degrees * Math.PI)/180;
    };
    const startLatRads = degreesToRadians(startLat);
    const startLonRads = degreesToRadians(startLon);
    const desLatRads = degreesToRadians(desLat);
    const desLonRads = degreesToRadians(desLon);
    const radius = 6372; // 지구 반경 거리 (km);
    const distance = Math.acos(Math.sin(startLatRads)*Math.sin(desLatRads) + Math.cos(startLatRads) * Math.cos(desLatRads) * Math.cos(startLonRads-desLonRads)) * radius;

    return distance;
};

export default getComputeDistance;
