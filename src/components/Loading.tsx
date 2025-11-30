import { Spinner } from "./ui/shadcn-io/spinner";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner />
      <p className="text-sm">Loading...</p>
    </div>
  );
}
