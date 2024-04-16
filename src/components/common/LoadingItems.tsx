import { Skeleton } from "../ui/skeleton";

const LoadingItems = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between border-b py-1">
        <Skeleton className="h-[20px] w-[250px] rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
        </div>
      </div>
      <div className="flex justify-between border-b py-1">
        <Skeleton className="h-[20px] w-[250px] rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
        </div>
      </div>
      <div className="flex justify-between border-b py-1">
        <Skeleton className="h-[20px] w-[250px] rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
        </div>
      </div>
      <div className="flex justify-between border-b py-1">
        <Skeleton className="h-[20px] w-[250px] rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
        </div>
      </div>
      <div className="flex justify-between border-b py-1">
        <Skeleton className="h-[20px] w-[250px] rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
          <Skeleton className="h-[20px] w-[20px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingItems;
