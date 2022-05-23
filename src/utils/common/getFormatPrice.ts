const getFormatPrice = (price: string) => {
  var regx = new RegExp(/(-?\d+)(\d{3})/);
  var pointIndex = price.indexOf('.', 0); // . index
  var priceArr = price.split('.');

  // priceArr[0]에 3자리수 콤마 다 찍을떄까지 반복
  while (regx.test(priceArr[0])) {
    priceArr[0] = priceArr[0].replace(regx, '$1,$2');
  }

  // while문이 종료되면 소수점이 없다면 바로 출력 / 있다면 소수점추가한 숫자를 출력
  if (pointIndex === -1) {
    // 소수점 없을때
    price = priceArr[0];
  } else {
    // 소수점 있을때
    price = priceArr[0] + '.' + priceArr[1];
  }
  return price;
};
export default getFormatPrice;
