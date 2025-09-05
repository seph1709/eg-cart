"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideShoppingCart } from "lucide-react";
import { useState } from "react";
import { login } from "@/api/apiAuth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    setIsLoading(true);
    e.preventDefault();
    const { data, error } = await login(email, password);

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
    } else {
      console.log(data);
      toast.success("Successfully Login!");
      router.push("/dashboard");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex text-lg font-semibold justify-center gap-x-2">
              <LucideShoppingCart /> E-G cart
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  onClick={handleLogin}
                  role="button"
                  className="cursor-pointer w-full"
                >
                  {isLoading ? <Spinner /> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
