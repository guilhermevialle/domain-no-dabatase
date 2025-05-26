export const isTimeMultipleOf = (time: string, value: number = 15) => {
  const [, minutes] = time.split(':').map(Number);
  return minutes % value === 0;
};
