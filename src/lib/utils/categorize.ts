const categorize = (
  text: string,
  categories: {
    name: string;
    match: {
      name: string;
    }[];
  }[],
) => {
  for (const { name, match } of categories) {
    for (const m of match) {
      const regex = new RegExp(m.name.replace(/\*/g, ".*"), "i");
      if (regex.test(text)) {
        return name;
      }
    }
  }
  return null;
};

export default categorize;
