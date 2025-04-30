import React, { useState, useRef } from "react";
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
import { loginSchema, registerSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useLoginApi,
  useRegisterApi,
} from "@/helper/apis/authentication/authentication";
import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import { LOGIN_PATH } from "@/routes/routeUrl";
import { Edit2Icon, Eye, EyeOff, FileEdit, UploadIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
function Register() {
  const inputRef = useRef(null);
  const { handleRegister, isLoading } = useRegisterApi();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select an image file");
      setFile(null);
      setPreview("");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const fileRef = ref(storage, `uploads/${file.name}`);

    try {
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    let url;
    if (file) url = await handleUpload();
    await handleRegister({ ...data, ...(url ? { avatar: url } : {}) });
  };
  return (
    <div className="min-h-screen h-full w-full flex justify-center items-center overflow-y-auto py-3">
      {/* <div className="text-black">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
        {url && (
          <a href={url} target="_blank">
            View File
          </a>
        )}
      </div> */}
      <Card className={` bg-black w-3/4 md:w-[55%] lg:w-[35%]  `}>
        <CardHeader className={`text-center`}>
          <div className="w-full flex justify-center  h-32">
            <img
              src="./images/F.svg"
              className="w-full max-w-[450px] h-full object-cover object-center"
              alt="logo"
            />
          </div>
          <CardTitle className="text-4xl tracking-tight text-white">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent className={""}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full p-2 flex flex-col gap-5"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />

            {file ? (
              <div className="w-20 h-20 rounded-full bg-white flex justify-center items-center shadow">
                <img
                  className="w-full h-full object-center object-cover rounded-full"
                  src={preview}
                  alt="profile"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white flex justify-center items-center shadow text-black">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <UploadIcon
                        onClick={() => inputRef.current.click()}
                        className="cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>click here to upload your picture</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <div className="flex flex-col text-white  gap-3 ">
              <Label htmlFor="terms">Name</Label>
              <div>
                <Input
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
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
              Sign up
            </Button>
            <CardDescription>
              if you already have an account,{" "}
              <Link
                to={LOGIN_PATH}
                className="text-blue-400 text-md cursor-pointer"
              >
                click here
              </Link>{" "}
              to sign in
            </CardDescription>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
