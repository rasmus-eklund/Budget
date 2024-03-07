import { datesSchema, type tDatesSchema } from "~/zodSchemas";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const parseSearch = ({ searchParams }: Props): tDatesSchema => {
  const parsed = datesSchema.safeParse(searchParams);
  if (!parsed.success) {
    return { from: new Date(), to: new Date() };
  }
  return parsed.data;
};

export default parseSearch;
