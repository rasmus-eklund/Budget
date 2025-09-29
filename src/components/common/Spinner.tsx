import { Icon } from "~/components/common";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center size-full">
      <Icon icon="Loader2Icon" className="animate-spin size-8 text-primary" />
    </div>
  );
};

export default Spinner;
