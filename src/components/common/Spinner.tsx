import { Icon } from "~/components/common";

const Spinner = () => {
  return (
    <div className="flex size-full items-center justify-center">
      <Icon icon="Loader" className="size-8 animate-spin text-primary" />
    </div>
  );
};

export default Spinner;
