import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React from "react";

const FolderBreadcrumb = ({ path, onNavigateToRoot, onNavigate }) => {
  const folders = path;
  const maxVisible = 4;

  const hiddenFolders =
    folders.length > maxVisible ? folders.slice(0, folders.length - 3) : [];
  const visibleFolders =
    folders.length > maxVisible ? folders.slice(folders.length - 3) : folders;

  return (
    <Breadcrumb className="mb-4 flex items-center">
      {/* Root: Filezone */}
      <BreadcrumbItem>
        <BreadcrumbLink
          className="cursor-pointer font-semibold"
          onClick={onNavigateToRoot}
        >
          Filezone
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* If there are folders after Filezone */}
      {folders.length > 0 && <BreadcrumbSeparator className={"list-none"} />}

      {/* Dropdown if needed */}
      {hiddenFolders.length > 0 && (
        <>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BreadcrumbLink className="cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </BreadcrumbLink>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {hiddenFolders.map((folder, index) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => onNavigate(index)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={"list-none"} />
        </>
      )}

      {/* Visible folders */}
      {visibleFolders.map((folder, index) => {
        const originalIndex = hiddenFolders.length + index;
        return (
          <React.Fragment key={folder.id}>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer hover:underline"
                onClick={() => onNavigate(originalIndex)}
              >
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < visibleFolders.length - 1 && (
              <BreadcrumbSeparator className={"list-none"} />
            )}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};

export default FolderBreadcrumb;
