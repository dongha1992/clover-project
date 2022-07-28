const calculatePoint = ({ rate, total }: { rate: number; total: number }) => {
  return Math.ceil(rate * total * 0.01);
};

export default calculatePoint;
