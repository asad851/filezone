import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginApi } from "@/helper/apis/authentication/authentication";
import { Link } from "react-router-dom";
import { REGISTER_PATH } from "@/routes/routeUrl";
import { Eye, EyeOff } from "lucide-react";
function Login() {
  const { handleLogin, isLoading } = useLoginApi();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    handleLogin(data);
  };
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Card className={` bg-black w-3/4 md:w-[55%] lg:w-[40%] xl:w-1/3  `}>
        <CardHeader className={`text-center`}>
          <div className="w-full h-32">
            <img
              src="./images/F.svg"
              className="w-full h-32 object-cover object-center"
              alt="logo"
            />
          </div>
          <CardTitle className="text-4xl tracking-tight text-white">
            Login
          </CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent className={""}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full p-2 flex flex-col gap-5"
          >
            <div className="flex flex-col text-white  gap-3 ">
              <Label htmlFor="terms">Email</Label>
              <div>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col text-white  gap-3">
              <Label htmlFor="terms">Password</Label>
              <div>
                <div className="relative">
                  <Input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primar bg-none hover:bg-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className={`mt-5`}>
              Sign in
            </Button>
            <CardDescription>
              if you dont have an account ,{" "}
              <Link
                to={REGISTER_PATH}
                className="text-blue-400 text-md cursor-pointer"
              >
                click here
              </Link>{" "}
              to sign up
            </CardDescription>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
