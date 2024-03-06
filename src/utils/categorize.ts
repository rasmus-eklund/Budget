function categorize(
  text: string,
  categories: { namn: string; matches: string[] }[],
): string {
  for (const { namn, matches } of categories) {
    for (const match of matches) {
      if (text.toLowerCase().includes(match.toLowerCase())) {
        return namn;
      }
    }
  }
  return "Övrigt";
}

export default categorize;
