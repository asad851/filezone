export const Folder = ({
  folder,
  onFolderClick,
  handleFolderClick,
  isSelected,
  rename,
  setRename,
}) => {
  return (
    <div className="p-3 max-w-50 max-h-55 flex flex-col justify-center items-center  ">
      <FolderIcon
        height={150}
        width={150}
        className="stroke-[0.2px] fill-amber-300 "
      />
      <p className="text-xs font-medium">name</p>
    </div>
  );
};
