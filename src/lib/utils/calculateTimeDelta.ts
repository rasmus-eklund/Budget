type Dates = { start: Date; end: Date };
const timeDelta = ({ start, end }: Dates): string => {
  const diff = end.getTime() - start.getTime();
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const milliseconds = diff % 1000;
  return `${seconds} s, ${milliseconds} ms`;
};

export default timeDelta;
