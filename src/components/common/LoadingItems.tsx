import { Label, Skeleton } from "~/components/ui";

type Props = { page: string };
const LoadingItems = ({ page }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-semibold">Dina {page.toLowerCase()}er:</h2>
      <div className="flex flex-col gap-1">
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
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>{page}</Label>
          <Skeleton className="h-[30px] w-full py-[4px]" />
          <p className="text-sm text-muted-foreground">
            Lägg till en ny {page.toLowerCase()}.
          </p>
        </div>
        <Skeleton className="h-[30px] w-[100px]" />
      </div>
    </div>
  );
};

export default LoadingItems;
