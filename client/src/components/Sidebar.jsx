import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { File, PlusCircleIcon } from "lucide-react";
import { useGetSegmentQuery } from "@/helper/apis/folder/setup";

export default function AppSidebar() {
   const { data, error, isLoading } = useGetSegmentQuery();
  return (
    <div className="min-h-full w-80 py-5 ">
      <div className="py-5 border-b-2 flex flex-col gap-5">
        <Button>
          Add folder
          <PlusCircleIcon />
        </Button>
      
          <Button>
            Add file
            <File />
          </Button>
     
      </div>
    </div>
  );
}
