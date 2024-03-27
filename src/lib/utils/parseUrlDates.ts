import { datesSchema, type FromTo } from "~/lib/zodSchemas";
import { getCurrentYearMonth } from "./datePicker";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const parseSearch = ({ searchParams }: Props): FromTo => {
  const parsed = datesSchema.safeParse(searchParams);
  if (!parsed.success) {
    return getCurrentYearMonth();
  }
  return parsed.data;
};

export default parseSearch;
