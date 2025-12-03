"use client";
import { LucideKanban } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";
import {
  adminLoginPath,
  dashboardPath,
  indoorMapPath,
  scheduleTaskPath,
} from "@/path";
import { supabase } from "@/api/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className="fixed w-full z-20 bg-background/95">
      <div className="flex justify-between px-5 py-2.5 items-center">
        <Button className="flex gap-x-2 font-semibold" variant="ghost">
          <LucideKanban />
          <Link href={dashboardPath}>
            <h1 className="text-lg font-semibold">E-G Cart</h1>
          </Link>
        </Button>

        <div className="flex flex-row">
          <div>
            <Link href={dashboardPath}>
              <Button
                variant="ghost"
                className={`${
                  pathname == dashboardPath ? "text-black" : "text-gray-500"
                } hover:text-black`}
              >
                Products
              </Button>
            </Link>
          </div>
          <div>
            <Link href={scheduleTaskPath}>
              <Button
                variant="ghost"
                className={`${
                  pathname == scheduleTaskPath ? "text-black" : "text-gray-500"
                } hover:text-black`}
              >
                Schedule
              </Button>
            </Link>
          </div>
          <div>
            <Link href={indoorMapPath}>
              <Button
                variant="ghost"
                className={`${
                  pathname == indoorMapPath ? "text-black" : "text-gray-500"
                } hover:text-black`}
              >
                Indoor Map
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            role="button"
            className="cursor-pointer"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();

              if (error) {
                toast.error(error.message);
                throw new Error("Logout failed: " + error.message);
              } else {
                toast.success("Successfully Logout!");
                router.push(adminLoginPath);
              }
            }}
          >
            <h1>Logout</h1>
          </Button>
        </div>
      </div>
      <Separator />
    </nav>
  );
}

export default Header;
