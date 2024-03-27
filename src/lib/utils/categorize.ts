const categorize = (
  text: string,
  categories: { namn: string; matches: string[] }[],
) => {
  for (const { namn, matches } of categories) {
    for (const match of matches) {
      if (text.toLowerCase().includes(match.toLowerCase())) {
        return namn;
      }
    }
  }
  return null;
};

export default categorize;
