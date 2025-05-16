import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { logoutUser } from "@/store/auth/authSlice";
function Header() {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);
  const handleLogout = () => {
    console.log("sfds");
    Cookies.remove("token");
    localStorage.clear();
    dispatch(logoutUser());
  };
  return (
    <header className="  w-full sticky top-0">
      <nav className=" py-2 px-4 flex justify-between items-center ">
        <div>
          <img
            className="w-full h-16 object-contain object-center"
            src="/images/logo.png"
            alt=""
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={"size-13 p-0 rounded-full"} variant={"ghost"}>
              {" "}
              <Avatar className="size-13">
                <AvatarImage
                  className="w-full h-full"
                  src={userData?.avatar}
                  alt="profile"
                />
                <AvatarFallback>{userData?.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleLogout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}

export default Header;
