const getSpotDistanceUnit = (value: number) => {
    if (value <= 999) {
      return {
        distance: Math.round(value),
        unit: 'm',
      } 
    } else {
      return {
        distance : Number((value/1000).toFixed(2)),
        unit: 'km',
      } 
    };
};

export default getSpotDistanceUnit;