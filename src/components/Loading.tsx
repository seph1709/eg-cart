import { Spinner } from "./ui/shadcn-io/spinner";

export default function LoadingIndicator() {
  return (
    <div className="h-screen w-full flex flex-col justify-start items-center gap-4 mt-[150px]">
      <Spinner />
      <p className="text-sm">Loading...</p>
    </div>
  );
}
