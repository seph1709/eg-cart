import { Spinner } from "./ui/shadcn-io/spinner";

export default function LoadingIndicator() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-4">
      <Spinner />
      <p className="text-sm">Loading...</p>
    </div>
  );
}
