const categorize = (
  text: string,
  categories: { name: string; matches: string[] }[],
) => {
  for (const { name, matches } of categories) {
    for (const match of matches) {
      if (text.toLowerCase().includes(match.toLowerCase())) {
        return name;
      }
    }
  }
  return null;
};

export default categorize;
